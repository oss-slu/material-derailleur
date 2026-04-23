import { Router, Request, Response } from 'express';
import multer from 'multer';
import { Readable } from 'stream';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import prisma from '../prismaClient';
import csv from 'csv-parser';
import { validateProgram } from '../services/programService';
import { validateIndividualFileSize } from '../services/donatedItemService';
import {
    sendApprovalRequestEmail,
    sendPasswordReset,
} from '../services/emailService';
import { getRandomPassword } from './donorRoutes';
import { authenticateUser } from './routeProtection';

const router = Router();
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { files: 1 },
});

type CsvRow = Record<string, string>;

type ItemAttributeInput = {
    descriptor: string;
    stringValue?: string;
    numberValue?: number;
    booleanValue?: boolean;
};

type PartialItemAttributeInput = ItemAttributeInput | null;

type ExportAttribute = {
    descriptor: string | null;
    stringValue?: string | null;
    numberValue?: number | null;
    booleanValue?: boolean | null;
};

const normalizeCell = (value: unknown): string =>
    typeof value === 'string' ? value.trim() : '';

const parseOptionalNumber = (value: string): number | null => {
    if (!value) {
        return null;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
};

const getRowValue = (row: CsvRow, ...keys: string[]): string => {
    for (const key of keys) {
        const value = normalizeCell(row[key]);
        if (value) {
            return value;
        }
    }

    return '';
};

const stringifyCsvValue = (value: unknown): string => {
    if (value === null || value === undefined) {
        return '';
    }

    return String(value).replace(/"/g, '""');
};

const getAttributeExportValue = (attribute?: ExportAttribute): string => {
    if (!attribute) {
        return '';
    }

    if (attribute.stringValue !== null && attribute.stringValue !== undefined) {
        return attribute.stringValue;
    }
    if (attribute.numberValue !== null && attribute.numberValue !== undefined) {
        return String(attribute.numberValue);
    }
    if (
        attribute.booleanValue !== null &&
        attribute.booleanValue !== undefined
    ) {
        return String(attribute.booleanValue);
    }

    return '';
};

function parseCsvBuffer(buffer: Buffer): Promise<CsvRow[]> {
    return new Promise((resolve, reject) => {
        const rows: CsvRow[] = [];

        Readable.from(buffer)
            .pipe(
                csv({
                    mapHeaders: ({ header }) =>
                        header
                            .trim()
                            .replace(/^\uFEFF/, '')
                            .toLowerCase(),
                }),
            )
            .on('data', row => rows.push(row as CsvRow))
            .on('end', () => resolve(rows))
            .on('error', reject);
    });
}

function buildAttributesFromRow(row: CsvRow): ItemAttributeInput[] {
    const bikeType = getRowValue(row, 'Type', 'type');
    const color = getRowValue(row, 'Color', 'color');
    const standoverHeight = parseOptionalNumber(
        getRowValue(
            row,
            'Standover Height',
            'standover height',
            'standover height (in.)',
        ),
    );
    const wheelSize = parseOptionalNumber(
        getRowValue(row, 'Wheel Size', 'wheel size', 'wheel size (in.)'),
    );

    const attributes: PartialItemAttributeInput[] = [
        bikeType
            ? {
                  descriptor: 'type',
                  stringValue: bikeType,
              }
            : null,
        color
            ? {
                  descriptor: 'color',
                  stringValue: color,
              }
            : null,
        standoverHeight !== null
            ? {
                  descriptor: 'standover height (in.)',
                  numberValue: standoverHeight,
              }
            : null,
        wheelSize !== null
            ? {
                  descriptor: 'wheel size (in.)',
                  numberValue: wheelSize,
              }
            : null,
    ];

    return attributes.filter(
        (attribute): attribute is ItemAttributeInput => attribute !== null,
    );
}

async function findOrCreateDonorByEmail(email: string) {
    const existingDonor = await prisma.donor.findUnique({
        where: { email },
    });

    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    // If no account exists for this donor:
    if (!existingUser) {
        const name = email.split('@')[0];
        const donorPassword = getRandomPassword();
        const hashedPassword = await bcrypt.hash(donorPassword, 10);

        console.log('CSV Import creating account for', name, email);
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: 'DONOR',
                status: 'PENDING',
                firstLogin: true,
            },
        });
        /* Important Note: This will create a new account with a random password for the user but
        it will never be sent to the user or ever used to login, and the new user will not receive
        a password reset link. This is intentional.
        If we were to send the password, that is highly insecure.
        If we were to send a reset, expiration time would need to be high, which is also insecure.
        In addition, there would be a high likelihood of email spam which causes other problems.
        The only option here is to set a dummy password (but still secure) and then just let the
        user do "forgot password" on their own time. 
        This is done with the idea that there could be hundreds or thousands of users.
        */
    }

    // If donor exists
    if (existingDonor) {
        return existingDonor;
    }

    // If not, create a new one
    return prisma.donor.create({
        data: {
            firstName: '',
            lastName: '',
            email,
            zipcode: '',
            emailOptIn: false,
        },
    });
}

// POST /api/csv - Import multiple donated items from a CSV upload
router.post(
    '/api/csv',
    [upload.array('csvFile', 1)],
    async (req: Request, res: Response) => {
        try {
            const permGranted = await authenticateUser(req, res, {
                requiredRank: 4,
            });
            if (!permGranted) return;

            const csvFile = (
                req.files as Express.Multer.File[] | undefined
            )?.[0];
            if (
                !csvFile ||
                !csvFile.originalname.toLowerCase().endsWith('.csv')
            ) {
                return res
                    .status(400)
                    .json({ message: 'Missing required csv file' });
            }

            validateIndividualFileSize([csvFile]);

            const programId = null;
            const itemType = 'bicycle';
            const quantity = 1;
            const currentStatus = 'Received';

            const dateDonatedDateTime = new Date();
            dateDonatedDateTime.setUTCHours(0, 0, 0, 0);

            const rows = await parseCsvBuffer(csvFile.buffer);
            if (rows.length === 0) {
                return res.status(400).json({ error: 'CSV file is empty' });
            }

            const importedItems: number[] = [];
            const failedRows: Array<{ rowNumber: number; error: string }> = [];

            for (const [index, row] of rows.entries()) {
                try {
                    const rawCsvId = getRowValue(row, 'ID', 'id');
                    const csvId = Number(rawCsvId);
                    const category = getRowValue(
                        row,
                        'Bike Name',
                        'bike name',
                        'Item Name',
                        'item name',
                        'Category',
                        'category',
                    );
                    const donorEmail = getRowValue(
                        row,
                        'Donor Email',
                        'donorEmail',
                        'donor email',
                        'Email',
                        'email',
                    ).toLowerCase();

                    if (!rawCsvId || !Number.isInteger(csvId) || csvId <= 0) {
                        throw new Error(
                            'CSV row is missing a valid numeric id',
                        );
                    }
                    if (!category) {
                        throw new Error(
                            'CSV row is missing Bike Name for category',
                        );
                    }
                    if (!donorEmail) {
                        throw new Error('CSV row is missing donor email');
                    }

                    const donor = await findOrCreateDonorByEmail(donorEmail);

                    const existingItem = await prisma.donatedItem.findUnique({
                        where: { id: csvId },
                        select: { id: true },
                    });
                    if (existingItem) {
                        throw new Error(
                            `Donated item with id ${csvId} already exists`,
                        );
                    }

                    const newItem = await prisma.donatedItem.create({
                        data: {
                            id: csvId,
                            itemType,
                            category,
                            quantity,
                            currentStatus,
                            dateDonated: dateDonatedDateTime,
                            donorId: donor.id,
                            programId,
                            attributes: {
                                create: buildAttributesFromRow(row),
                            },
                        },
                    });

                    await prisma.donatedItemStatus.create({
                        data: {
                            statusType: currentStatus,
                            dateModified: dateDonatedDateTime,
                            donatedItemId: newItem.id,
                        },
                    });

                    importedItems.push(newItem.id);
                } catch (error) {
                    failedRows.push({
                        rowNumber: index + 2,
                        error:
                            error instanceof Error
                                ? error.message
                                : 'Unknown import error',
                    });
                }
            }

            const responseStatus = failedRows.length > 0 ? 207 : 201;

            return res.status(responseStatus).json({
                message:
                    failedRows.length > 0
                        ? 'CSV import completed with some errors'
                        : 'CSV import completed successfully',
                importedCount: importedItems.length,
                failedCount: failedRows.length,
                importedItemIds: importedItems,
                failedRows,
            });
        } catch (error) {
            if (
                error instanceof multer.MulterError &&
                error.code === 'LIMIT_FILE_SIZE'
            ) {
                return res
                    .status(400)
                    .json({ message: 'Attached file should not exceed 5MB.' });
            }
            if (error instanceof Error) {
                return res.status(400).json({ error: error.message });
            }
            return res
                .status(500)
                .json({ message: 'Error importing CSV file' });
        }
    },
);

// GET /api/csv - Export donated items as a CSV download
router.get('/api/csv', async (req: Request, res: Response) => {
    try {
        const permGranted = await authenticateUser(req, res, {
            requiredRank: 4,
        });
        if (!permGranted) return;

        const attributes = await prisma.itemAttribute.groupBy({
            by: ['descriptor'],
            orderBy: {
                descriptor: 'asc',
            },
        });

        const attributeHeaders = Array.from(
            new Set(
                attributes
                    .map(attribute => attribute.descriptor)
                    .filter(
                        (descriptor): descriptor is string =>
                            typeof descriptor === 'string' &&
                            descriptor.trim().length > 0,
                    ),
            ),
        ).sort();

        const headers = [
            'ID',
            'Item Type',
            'Item Name',
            'Quantity',
            'Current Status',
            'Date Donated',
            'Donor Email',
            'Program ID',
            ...attributeHeaders,
        ];

        const items = await prisma.donatedItem.findMany({
            include: {
                donor: true,
                attributes: true,
            },
        });

        const rows = items.map(item => {
            const attributeMap = new Map(
                item.attributes.map(attribute => [
                    attribute.descriptor,
                    attribute as ExportAttribute,
                ]),
            );

            return [
                item.id,
                item.itemType,
                item.category,
                item.quantity,
                item.currentStatus,
                item.dateDonated.toISOString(),
                item.donor?.email ?? '',
                item.programId ?? '',
                ...attributeHeaders.map(header =>
                    getAttributeExportValue(attributeMap.get(header)),
                ),
            ];
        });

        const csvContent = [headers, ...rows]
            .map(row =>
                row.map(value => `"${stringifyCsvValue(value)}"`).join(','),
            )
            .join('\n');

        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader(
            'Content-Disposition',
            'attachment; filename="donated-items-export.csv"',
        );
        res.status(200).send(csvContent);
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching donated item:', error.message);
            res.status(
                error.message.includes('must be an integer') ? 400 : 404,
            ).json({ error: error.message });
            console.error('Error exporting CSV file:', error.message);
            return res.status(500).json({
                error: 'Error exporting CSV file',
                details: error.message,
            });
        } else {
            console.error('Error fetching donated item:', 'Unknown error');
            res.status(500).json({ error: 'Unknown error' });
            console.error('Error exporting CSV file:', 'Unknown error');
            return res.status(500).json({ error: 'Error exporting CSV file' });
        }
    }
});

export default router;
