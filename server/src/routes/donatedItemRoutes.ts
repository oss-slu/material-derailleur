import { Router, Request, Response } from 'express';
import multer from 'multer';
import prisma from '../prismaClient'; // Import Prisma client
import { donatedItemValidator } from '../validators/donatedItemValidator'; // Import the validator
import { validateDonor } from '../services/donorService';
import { validateProgram } from '../services/programService';
import {
    fetchImagesFromCloud,
    validateDonatedItem,
    validateIndividualFileSize,
} from '../services/donatedItemService';
import {
    uploadToStorage,
    getFileExtension,
} from '../services/donatedItemService';
import { date } from 'joi';
import { DonatedItemStatus } from '../modals/DonatedItemStatusModal';
import { sendDonationEmail } from '../services/emailService';
import { authenticateUser } from './routeProtection';
import { DonatedItem } from '@prisma/client';

const router = Router();
const MAX_FILE_SIZE = 5 * 1024 * 1024; // Max file size limit: 5MB
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { files: 5 },
});

// POST /donatedItem - Create a new DonatedItem
router.post(
    '/',
    [upload.array('imageFiles', 5), donatedItemValidator], // Allow up to 5 image files
    async (req: Request, res: Response) => {
        try {
            const permGranted = await authenticateUser(req, res, true);
            if (permGranted) {
                const imageFiles = req.files as Express.Multer.File[];
                // Call service functions for validation
                validateIndividualFileSize(imageFiles);

                const donorId = parseInt(req.body.donorId);
                const programId = parseInt(req.body.programId);
                const { dateDonated, ...rest } = req.body;

                try {
                    await validateDonor(donorId);
                    await validateProgram(programId);
                } catch (error) {
                    if (error instanceof Error) {
                        console.log('error', error);
                        return res.status(400).json({ error: error.message });
                    }
                }
                const dateDonatedDateTime = new Date(dateDonated);
                dateDonatedDateTime.setUTCHours(0, 0, 0, 0); // Set time to 00:00:00 UTC

                const newItem = await prisma.donatedItem.create({
                    data: {
                        ...rest, //spread the rest of the fields
                        donorId,
                        programId,
                        dateDonated: dateDonatedDateTime,
                    },
                    include: {
                        donor: true, // Ensure donor details are fetched
                        statuses: {
                            orderBy: {
                                dateModified: 'asc', // Ensure they are ordered chronologically
                            },
                        },
                    },
                });

                // Upload images to cloud storage and get their filenames
                const imageUrls = await Promise.all(
                    imageFiles.map(async file => {
                        const fileExtension = getFileExtension(file.mimetype);
                        const formattedDate = new Date().toISOString();
                        return uploadToStorage(
                            file,
                            `item-${formattedDate}-${newItem.id}${fileExtension}`,
                        );
                    }),
                );

                const newStatus = await prisma.donatedItemStatus.create({
                    data: {
                        statusType: 'Received',
                        dateModified: dateDonatedDateTime, // Use the same date as dateDonated
                        donatedItemId: newItem.id,
                        imageUrls: imageUrls,
                    },
                });

                // Send email notification to the donor
                if (newItem.donor?.email) {
                    await sendDonationEmail(
                        newItem.donor.email,
                        `${newItem.donor.firstName} ${newItem.donor.lastName}`,
                        newItem.itemType,
                        newItem.dateDonated,
                        newStatus.imageUrls,
                    );
                }

                res.status(201).json({
                    donatedItem: newItem,
                    donatedItemStatus: newStatus,
                });
            }
        } catch (error) {
            // Handle errors for exceeding file size limit
            if (
                error instanceof multer.MulterError &&
                error.code === 'LIMIT_FILE_SIZE'
            ) {
                return res
                    .status(400)
                    .json({ message: 'Attached files should not exceed 5MB.' });
            }
            // Handle generic errors
            if (error instanceof Error) {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ message: 'Error creating donated item' });
        }
    },
);

// GET /donatedItem - Fetch all donated items
router.get('/', async (req: Request, res: Response) => {
    try {
        const permGranted = await authenticateUser(req, res, true);
        if (permGranted) {
            const donatedItems = await prisma.donatedItem.findMany({
                include: {
                    donor: true, // Include all donor details
                    program: true, // Include all program details
                    statuses: {
                        orderBy: {
                            dateModified: 'asc', // Ensure they are ordered chronologically
                        },
                    },
                },
            });
            res.json(donatedItems);
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching donated item:', error.message);
            res.status(
                error.message.includes('must be an integer') ? 400 : 404,
            ).json({ error: error.message });
        } else {
            console.error('Error fetching donated item:', 'Unknown error');
            res.status(500).json({ error: 'Unknown error' });
        }
    }
});

// GET /donatedItem - Fetch donated item by ID
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const permGranted = await authenticateUser(req, res, true);
        if (permGranted) {
            const donatedItemId = parseInt(req.params.id);
            await validateDonatedItem(donatedItemId);
            const donatedItem = await prisma.donatedItem.findUnique({
                where: { id: donatedItemId },
                include: {
                    donor: true, // Include all donor details
                    program: true, // Include all program details
                    statuses: {
                        orderBy: {
                            dateModified: 'asc', // Ensure they are ordered chronologically
                        },
                    },
                },
            });

            if (!donatedItem) {
                return res.status(404).json({
                    error: `Donated item with ID ${donatedItemId} not found`,
                });
            }

            // Process each status to fetch and encode its images
            await Promise.all(
                donatedItem.statuses.map(async (status: DonatedItemStatus) => {
                    const filenames = status.imageUrls || [];
                    const encodedImages = await fetchImagesFromCloud(filenames);
                    status.images = encodedImages;
                }),
            );

            res.json(donatedItem);
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching donated item:', error.message);
            res.status(
                error.message.includes('must be an integer') ? 400 : 404,
            ).json({ error: error.message });
        } else {
            console.error('Error fetching donated item:', 'Unknown error');
            res.status(500).json({ error: 'Unknown error' });
        }
    }
});

// PUT /donatedItem/details/:id - Update donated item details (excluding status)
router.put(
    '/details/:id',
    donatedItemValidator,
    async (req: Request, res: Response) => {
        try {
            const donorId = parseInt(req.body.donorId);
            const programId = parseInt(req.body.programId);

            try {
                await validateDonor(donorId);
                await validateProgram(programId);
            } catch (error) {
                if (error instanceof Error) {
                    return res.status(400).json({ error: error.message });
                }
            }

            const dateDonatedDateTime = new Date(req.body.dateDonated);

            const updatedItem = await prisma.donatedItem.update({
                where: { id: Number(req.params.id) },
                data: {
                    itemType: req.body.itemType,
                    dateDonated: dateDonatedDateTime,
                    donorId,
                    programId,
                    lastUpdated: new Date(),
                },
            });

            console.log(
                'Donated item updated (admin-only, no status):',
                updatedItem,
            );
            res.status(200).json({
                message: 'Item updated successfully',
                data: updatedItem,
            });
        } catch (error) {
            console.error('Error updating donated item details:', error);
            res.status(500).json({
                message: 'Error updating donated item details',
            });
        }
    },
);

//Added cascade deletion of statuses
// DELETE /donatedItem/:id - Delete a DonatedItem with cascading deletion of its statuses
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const deletedItem = await prisma.donatedItem.delete({
            where: { id: Number(req.params.id) },
        });
        console.log('Donated item deleted:', deletedItem);
        res.status(200).json(deletedItem);
    } catch (error) {
        console.error('Error deleting donated item:', error);
        res.status(500).json({ message: 'Error deleting donated item' });
    }
});

export default router;
