import { Router, Request, Response } from 'express';
import multer from 'multer';
import { Readable } from 'stream';
import prisma from '../prismaClient';
import csv from 'csv-parser';
import { validateProgram } from '../services/programService';
import { validateIndividualFileSize } from '../services/donatedItemService';
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

function parseCsvBuffer(buffer: Buffer): Promise<CsvRow[]> {
    return new Promise((resolve, reject) => {
        const rows: CsvRow[] = [];

        Readable.from(buffer)
            .pipe(csv())
            .on('data', row => rows.push(row as CsvRow))
            .on('end', () => resolve(rows))
            .on('error', reject);
    });
}

function buildAttributesFromRow(row: CsvRow): ItemAttributeInput[] {
    const bikeType = getRowValue(row, 'Type', 'type');
    const color = getRowValue(row, 'Color', 'color');
    const standoverHeight = parseOptionalNumber(
        getRowValue(row, 'Standover Height', 'standover height'),
    );
    const wheelSize = parseOptionalNumber(
        getRowValue(row, 'Wheel Size', 'wheel size'),
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

    if (existingDonor) {
        return existingDonor;
    }

    return prisma.donor.create({
        data: {
            firstName: '',
            lastName: 'Imported',
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

            const csvFile = (req.files as Express.Multer.File[] | undefined)?.[0];
            if (!csvFile) {
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
                    );
                    const donorEmail = getRowValue(
                        row,
                        'Donor Email',
                        'donorEmail',
                        'Email',
                        'email',
                    ).toLowerCase();

                    if (!rawCsvId || !Number.isInteger(csvId) || csvId <= 0) {
                        throw new Error('CSV row is missing a valid numeric id');
                    }
                    if (!category) {
                        throw new Error(
                            'CSV row is missing Bike Name for category',
                        );
                    }
                    if (!donorEmail) {
                        throw new Error(
                            'CSV row is missing donor email',
                        );
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

            const responseStatus =
                failedRows.length > 0
                    ? importedItems.length > 0
                        ? 207
                        : 400
                    : 201;

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
            return res.status(500).json({ message: 'Error importing CSV file' });
        }
    },
);

export default router;
