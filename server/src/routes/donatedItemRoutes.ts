// src/routes/donatedItemRoutes.ts
import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import os from 'os';
import prisma from '../prismaClient'; // singleton prisma client
import { donatedItemValidator } from '../validators/donatedItemValidator';
import { validateDonor } from '../services/donorService';
import { validateProgram } from '../services/programService';
import {
  fetchImagesFromCloud,
  validateDonatedItem,
  validateIndividualFileSize,
  uploadToStorage,
  getFileExtension,
} from '../services/donatedItemService';
import { DonatedItemStatus } from '../modals/DonatedItemStatusModal';
import { sendDonationEmail } from '../services/emailService';
import { authenticateUser } from './routeProtection';
import { date } from 'joi';
import {
  analyzeImageTags,
  getImageTags,
} from '../services/imageAnalysisService';

const router = Router();
const MAX_FILE_SIZE = 5 * 1024 * 1024; // Max file size limit: 5MB
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { files: 5 },
});


function writeTempFileFromBuffer(buf: Buffer, ext = '.jpg'): string {
  const tmp = path.join(
    os.tmpdir(),
    `donated-item-${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`,
  );
  fs.writeFileSync(tmp, buf);
  return tmp;
}

function writeTempFileFromBase64(base64: string, ext = '.jpg'): string {
  const tmp = path.join(
    os.tmpdir(),
    `donated-item-${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`,
  );
  const data = base64.replace(/^data:.*;base64,/, '');
  fs.writeFileSync(tmp, Buffer.from(data, 'base64'));
  return tmp;
}

// POST /donatedItem - Create a new DonatedItem (original flow + analysis)
router.post(
  '/',
  [upload.array('imageFiles', 5), donatedItemValidator],
  async (req: Request, res: Response) => {
    try {
      const permGranted = await authenticateUser(req, res, true);
      if (!permGranted) return;

      const imageFiles = (req.files as Express.Multer.File[]) || [];
      validateIndividualFileSize(imageFiles);

      // Coerce & validate inputs explicitly so we don't spread raw req.body
      const donorId = Number(req.body.donorId);
      const programId = Number(req.body.programId);

      const itemType = String(req.body.itemType ?? req.body.itemName ?? '').trim();
      const category = String(req.body.category ?? '').trim();
      const quantity = Number(req.body.quantity ?? 1);
      const currentStatus = String(req.body.currentStatus ?? req.body.status ?? 'Received').trim();

      const optOutAnalysis = String(req.body.optOutAnalysis ?? 'false') === 'true';

      if (!itemType) return res.status(400).json({ error: 'itemType is required' });
      if (!category) return res.status(400).json({ error: 'category is required' });
      if (!Number.isFinite(quantity) || quantity < 1) {
        return res.status(400).json({ error: 'quantity must be a positive number' });
      }
      if (!Number.isInteger(donorId) || donorId <= 0) {
        return res.status(400).json({ error: 'donorId must be a positive integer' });
      }
      if (!Number.isInteger(programId) || programId <= 0) {
        return res.status(400).json({ error: 'programId must be a positive integer' });
      }

      // validate donor/program exist
      try {
        await validateDonor(donorId);
        await validateProgram(programId);
      } catch (e) {
        if (e instanceof Error) return res.status(400).json({ error: e.message });
      }

      // date
      const dateDonatedRaw = String(req.body.dateDonated ?? '').trim();
      const dateDonatedDateTime = dateDonatedRaw ? new Date(dateDonatedRaw) : new Date();
      if (isNaN(dateDonatedDateTime.getTime())) {
        return res.status(400).json({ error: 'dateDonated is invalid' });
      }
      dateDonatedDateTime.setUTCHours(0, 0, 0, 0);

      // create item
      const newItem = await prisma.donatedItem.create({
        data: {
          itemType,
          category,
          quantity,
          currentStatus,
          dateDonated: dateDonatedDateTime,
          donorId,
          programId,
          
        },
        include: {
          donor: true,
          statuses: { orderBy: { dateModified: 'asc' } },
        },
      });

      // upload all images to cloud storage
      const imageUrls = await Promise.all(
        imageFiles.map(async (file) => {
          const fileExtension = getFileExtension(file.mimetype);
          const formattedDate = new Date().toISOString();
          return uploadToStorage(
            file,
            `item-${formattedDate}-${newItem.id}${fileExtension}`,
          );
        }),
      );

      // initial status
      const newStatus = await prisma.donatedItemStatus.create({
        data: {
          statusType: 'Received',
          dateModified: dateDonatedDateTime,
          donatedItemId: newItem.id,
          imageUrls,
        },
      });

      // donor email
      if (newItem.donor?.email) {
        await sendDonationEmail(
          newItem.donor.email,
          `${newItem.donor.firstName} ${newItem.donor.lastName}`,
          newItem.itemType,
          newItem.dateDonated,
          newStatus.imageUrls,
        );
      }

      // optional: run analysis on first uploaded image
      if (!optOutAnalysis && imageFiles.length > 0) {
        try {
          const first = imageFiles[0];
          const ext = getFileExtension(first.mimetype) || '.jpg';
          const tmpPath = writeTempFileFromBuffer(first.buffer, ext);

          try {
            const analysis = await analyzeImageTags(tmpPath, newItem.id, false);
            return res.status(201).json({
              donatedItem: newItem,
              donatedItemStatus: newStatus,
              analysis,
              message: 'Donated item created with image analysis',
            });
          } finally {
            fs.existsSync(tmpPath) && fs.unlinkSync(tmpPath);
          }
        } catch (analysisErr) {
          console.error('Image analysis failed (continuing):', analysisErr);
          return res.status(201).json({
            donatedItem: newItem,
            donatedItemStatus: newStatus,
            warning: 'Donated item created, but image analysis failed',
          });
        }
      }

      // no analysis or no images
      return res.status(201).json({
        donatedItem: newItem,
        donatedItemStatus: newStatus,
        message: optOutAnalysis
          ? 'Donated item created (image analysis opted out)'
          : 'Donated item created',
      });
    } catch (error) {
      if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'Attached files should not exceed 5MB.' });
      }
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ message: 'Error creating donated item' });
    }
  },
);


router.get('/', async (req: Request, res: Response) => {
  try {
    const permGranted = await authenticateUser(req, res, true);
    if (!permGranted) return;

    const donatedItems = await prisma.donatedItem.findMany({
      include: {
        donor: true,
        program: true,
        statuses: { orderBy: { dateModified: 'asc' } },
      },
    });
    res.json(donatedItems);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching donated item:', error.message);
      res
        .status(error.message.includes('must be an integer') ? 400 : 404)
        .json({ error: error.message });
    } else {
      console.error('Error fetching donated item:', 'Unknown error');
      res.status(500).json({ error: 'Unknown error' });
    }
  }
});


router.get('/:id', async (req: Request, res: Response) => {
  try {
    const permGranted = await authenticateUser(req, res, true);
    if (!permGranted) return;

    const donatedItemId = parseInt(req.params.id);
    await validateDonatedItem(donatedItemId);

    const donatedItem = await prisma.donatedItem.findUnique({
      where: { id: donatedItemId },
      include: {
        donor: true,
        program: true,
        statuses: { orderBy: { dateModified: 'asc' } },
      },
    });

    if (!donatedItem) {
      return res
        .status(404)
        .json({ error: `Donated item with ID ${donatedItemId} not found` });
    }

    // hydrate images from cloud
    await Promise.all(
      donatedItem.statuses.map(async (status: DonatedItemStatus) => {
        const filenames = status.imageUrls || [];
        const encodedImages = await fetchImagesFromCloud(filenames);
        status.images = encodedImages;
      }),
    );

    res.json(donatedItem);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching donated item:', error.message);
      res
        .status(error.message.includes('must be an integer') ? 400 : 404)
        .json({ error: error.message });
    } else {
      console.error('Error fetching donated item:', 'Unknown error');
      res.status(500).json({ error: 'Unknown error' });
    }
  }
});


router.put('/details/:id', donatedItemValidator, async (req: Request, res: Response) => {
  try {
    const donorId = Number(req.body.donorId);
    const programId = Number(req.body.programId);

    try {
      await validateDonor(donorId);
      await validateProgram(programId);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ error: err.message });
      }
    }

    const updatedItem = await prisma.donatedItem.update({
      where: { id: Number(req.params.id) },
      data: {
        itemType: String(req.body.itemType ?? ''),
        category: String(req.body.category ?? '').trim(),
        quantity: Number(req.body.quantity ?? 1),
        currentStatus: String(req.body.currentStatus ?? 'Received'),
        donorId,
        programId,
        lastUpdated: new Date(),
      },
    });

    console.log('Donated item updated:', updatedItem);
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating donated item details:', error);
    res.status(500).json({ message: 'Error updating donated item details' });
  }
});


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

// GET /donatedItem/:id/tags
router.get('/:id/tags', async (req: Request, res: Response) => {
  try {
    const permGranted = await authenticateUser(req, res, true);
    if (!permGranted) return;

    const donatedItemId = parseInt(req.params.id);
    if (isNaN(donatedItemId)) {
      return res.status(400).json({ message: 'Invalid donated item ID' });
    }

    const tags = await getImageTags(donatedItemId);
    return res.status(200).json({
      message: 'Tags retrieved successfully',
      donatedItemId,
      tags,
    });
  } catch (error) {
    console.error('Error retrieving tags:', error);
    res.status(500).json({ message: 'Error retrieving tags' });
  }
});

// POST /donatedItem/:id/reanalyze
router.post('/:id/reanalyze', async (req: Request, res: Response) => {
  try {
    const permGranted = await authenticateUser(req, res, true);
    if (!permGranted) return;

    const donatedItemId = parseInt(req.params.id);
    if (isNaN(donatedItemId)) {
      return res.status(400).json({ message: 'Invalid donated item ID' });
    }

    // most recent status images
    const item = await prisma.donatedItem.findUnique({
      where: { id: donatedItemId },
      select: {
        statuses: {
          orderBy: { dateModified: 'desc' },
          take: 1,
          select: { imageUrls: true },
        },
      },
    });

    const urls = item?.statuses?.[0]?.imageUrls ?? [];
    if (urls.length === 0) {
      return res.status(404).json({ message: 'No images found to analyze for this item' });
    }

    // fetch the first image, write to temp, analyze
    const base64Images = await fetchImagesFromCloud([urls[0]]);
    if (!base64Images || base64Images.length === 0) {
      return res.status(404).json({ message: 'Could not fetch image from storage' });
    }

    const ext = path.extname(urls[0]) || '.jpg';
    const tmpPath = writeTempFileFromBase64(base64Images[0], ext);

    try {
      const analysis = await analyzeImageTags(tmpPath, donatedItemId, false);
      return res.status(200).json({
        message: 'Image reanalyzed successfully',
        analysis,
      });
    } finally {
      fs.existsSync(tmpPath) && fs.unlinkSync(tmpPath);
    }
  } catch (error) {
    console.error('Error reanalyzing image:', error);
    res.status(500).json({ message: 'Error reanalyzing image' });
  }
});

export default router;
