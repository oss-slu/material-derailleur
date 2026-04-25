import { Router, Request, Response } from 'express';
import prisma from '../prismaClient';
import { donatedItemStatusValidator } from '../validators/donatedItemStatusValidator';
import { authenticateUser } from './routeProtection';

import multer from 'multer';
import {
    fetchImagesFromCloud,
    uploadToStorage,
    getFileExtension,
} from '../services/donatedItemService';
import { sendDonationUpdateEmail } from '../services/emailService';
import { DonatedItemStatus } from '../modals/DonatedItemStatusModal';

const router = Router();

const upload = multer({ storage: multer.memoryStorage() });

type IncomingItemAttribute = {
    descriptor?: unknown;
    stringValue?: unknown;
    numberValue?: unknown;
    booleanValue?: unknown;
};

function parseItemAttributes(rawAttributes: unknown) {
    if (
        typeof rawAttributes !== 'string' ||
        rawAttributes.trim().length === 0
    ) {
        return [];
    }

    const parsed = JSON.parse(rawAttributes);
    if (!Array.isArray(parsed)) {
        throw new Error('itemAttributes must be an array');
    }

    return parsed
        .map((attribute: IncomingItemAttribute) => {
            const descriptor =
                typeof attribute?.descriptor === 'string'
                    ? attribute.descriptor.trim()
                    : '';

            if (!descriptor) {
                return null;
            }

            const stringValue =
                typeof attribute?.stringValue === 'string'
                    ? attribute.stringValue.trim()
                    : null;
            const numberValue =
                typeof attribute?.numberValue === 'number' &&
                Number.isFinite(attribute.numberValue)
                    ? attribute.numberValue
                    : null;
            const booleanValue =
                typeof attribute?.booleanValue === 'boolean'
                    ? attribute.booleanValue
                    : null;

            if (
                stringValue === null &&
                numberValue === null &&
                booleanValue === null
            ) {
                return null;
            }

            return {
                descriptor,
                stringValue,
                numberValue,
                booleanValue,
            };
        })
        .filter(
            (
                attribute,
            ): attribute is {
                descriptor: string;
                stringValue: string | null;
                numberValue: number | null;
                booleanValue: boolean | null;
            } => attribute !== null,
        );
}

// PUT /donatedItem/status/:id - Update the status of a DonatedItem
router.post(
    '/:id',
    [upload.array('imageFiles'), donatedItemStatusValidator],
    donatedItemStatusValidator,
    async (req: Request, res: Response) => {
        try {
            const permGranted = await authenticateUser(req, res, {
                requiredRank: 1,
            });
            if (permGranted) {
                const donatedItemId = Number(req.params.id);

                const { statusType, dateModified, informDonor, submitter } =
                    req.body;
                const imageFiles = req.files as Express.Multer.File[];
                const itemAttributes = parseItemAttributes(
                    req.body.itemAttributes,
                );

                if (!statusType) {
                    return res
                        .status(400)
                        .json({ error: 'status is required' });
                }
                const imageUrls = await Promise.all(
                    imageFiles.map(async file => {
                        const fileExtension = getFileExtension(file.mimetype);
                        const formattedDate = new Date().toISOString();

                        return uploadToStorage(
                            file,
                            `item-${formattedDate}-${donatedItemId}${fileExtension}`,
                        );
                    }),
                );
                // Update the donated item's current status and lastUpdated fields
                const updatedStatus = await prisma.donatedItem.update({
                    where: { id: Number(req.params.id) },
                    data: {
                        currentStatus: statusType,
                        lastUpdated: new Date(),
                        attributes:
                            req.body.itemAttributes !== undefined
                                ? {
                                      deleteMany: {},
                                      create: itemAttributes,
                                  }
                                : undefined,
                    },
                    // Return donor information and item type for email content
                    include: {
                        donor: true,
                        attributes: true,
                    },
                });

                // Create a new entry in DonatedItemStatus to track the status change
                const newStatus = await prisma.donatedItemStatus.create({
                    data: {
                        statusType: statusType,
                        dateModified: dateModified
                            ? new Date(dateModified)
                            : new Date(),
                        donatedItemId,
                        imageUrls,
                        donorInformed: informDonor == 'true',
                        approval: false,
                        submitter: submitter ?? '',
                    },
                });

                console.log(
                    'Donated item status updated succesfully:',
                    updatedStatus,
                );

                res.status(200).json({
                    message: 'Donated item status updated successfully',
                    updatedStatus,
                    newStatus,
                });
            }
        } catch (error) {
            console.error('Error updating donated item status:', error);
            res.status(500).json({
                message: 'Error updating donated item status',
            });
        }
    },
);

// Admin Image Approval Routes
// GET /donatedItem/status/review/ - Get all statuses needing review
router.get(
    '/review',
    donatedItemStatusValidator,
    async (req: Request, res: Response) => {
        try {
            const permGranted = await authenticateUser(req, res, {
                requiredRank: 3,
            });
            if (!permGranted) return;

            const donatedStatuses = await prisma.donatedItemStatus.findMany({
                where: { approval: false },
            });

            await Promise.all(
                donatedStatuses.map(async (status: DonatedItemStatus) => {
                    const filenames = status.imageUrls || [];
                    const encodedImages = await fetchImagesFromCloud(filenames);
                    status.images = encodedImages;
                }),
            );

            res.status(200).json(donatedStatuses);
        } catch (error) {
            if (error instanceof Error) {
                console.error(
                    'Error fetching pending statuses:',
                    error.message,
                );
                res.status(
                    error.message.includes('must be an integer') ? 400 : 404,
                ).json({ error: error.message });
            } else {
                console.error(
                    'Error fetching pending statuses:',
                    'Unknown error',
                );
                res.status(500).json({ error: 'Unknown error' });
            }
        }
    },
);

// PUT /donatedItem/status/review/:id - Approve status
router.put('/review/:id', async (req: Request, res: Response) => {
    try {
        const permGranted = await authenticateUser(req, res, {
            requiredRank: 3,
        });
        if (!permGranted) return;

        const statusId = Number(req.params.id);

        const statusItem = await prisma.donatedItemStatus.update({
            where: { id: statusId },
            data: {
                approval: true,
            },
        });

        const donatedItem = await prisma.donatedItem.findUnique({
            where: { id: statusItem.donatedItemId },
            include: {
                donor: true,
            },
        });

        // Send email notification to the donor about the status update if marked
        if (statusItem.donorInformed && donatedItem?.donor.email) {
            await sendDonationUpdateEmail(
                donatedItem.donor.email,
                `${donatedItem.donor.firstName} ${donatedItem.donor.lastName}`,
                donatedItem.id.toString(),
                statusItem.statusType,
                statusItem.dateModified,
                statusItem.imageUrls,
            );
            console.log('Donor sent email of new status');
        } else {
            console.log('Donor not marked to be informed');
        }

        res.status(200).json(statusItem);
    } catch (error) {
        console.error('Error approving donation status:', error);
        res.status(500).json({ message: 'Error approving donation status' });
    }
});

// DELETE /donatedItem/status/review/:id - Deny status
router.delete('/review/:id', async (req: Request, res: Response) => {
    try {
        const permGranted = await authenticateUser(req, res, {
            requiredRank: 3,
        });
        if (!permGranted) return;

        const statusId = Number(req.params.id);

        const statusItem = await prisma.donatedItemStatus.delete({
            where: { id: statusId },
        });
        console.log('Donation status denied:', statusItem);

        res.status(200).json(statusItem);
    } catch (error) {
        console.error('Error denying donation status:', error);
        res.status(500).json({ message: 'Error denying donation status' });
    }
});

export default router;
