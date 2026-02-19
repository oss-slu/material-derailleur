import { Router, Request, Response } from 'express';
import prisma from '../prismaClient'; // Import Prisma client
import { donatedItemStatusValidator } from '../validators/donatedItemStatusValidator'; // Import the validator
import { authenticateUser } from './routeProtection';

import multer from 'multer';
import {
    uploadToStorage,
    getFileExtension,
} from '../services/donatedItemService';
import { sendDonationUpdateEmail } from '../services/emailService';

const router = Router();

const upload = multer({ storage: multer.memoryStorage() });

// PUT /donatedItem/status/:id - Update the status of a DonatedItem
router.post(
    '/:id',
    [upload.array('imageFiles'), donatedItemStatusValidator],
    donatedItemStatusValidator,
    async (req: Request, res: Response) => {
        try {
            const permGranted = await authenticateUser(req, res, true);
            if (permGranted) {
                const donatedItemId = Number(req.params.id);

                const { statusType, dateModified, informDonor } = req.body;
                const imageFiles = req.files as Express.Multer.File[];

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
                    },
                    // Return donor information and item type for email content
                    include: {
                        donor: true,
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
                    },
                });

                console.log(
                    'Donated item status updated succesfully:',
                    updatedStatus,
                );

                // Send email notification to the donor about the status update if checkbox is checked
                if (informDonor === 'true' && updatedStatus.donor?.email) {
                    await sendDonationUpdateEmail(
                        updatedStatus.donor.email,
                        `${updatedStatus.donor.firstName} ${updatedStatus.donor.lastName}`,
                        donatedItemId.toString(),
                        newStatus.statusType,
                        newStatus.dateModified,
                        newStatus.imageUrls,
                    );
                }

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

export default router;
