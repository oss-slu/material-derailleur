import express from 'express';
import path from 'path';
import fs from 'fs';
import { generatePDF } from '../services/certificateService';

const router = express.Router();

// GET /api/certificates/:donorId/download
router.get('/:donorId/download', (req, res) => {
  const { donorId } = req.params;

  // Adjust the path to match where your PDFs are stored
  const filePath = path.join(__dirname, '../../../certificates', `certificate-${donorId}.pdf`);

  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).send('Certificate not found');
  }
});
router.post('/generate', async (req, res) => {
  try {
    const item = req.body.item;
    const pdfBuffer = await generatePDF(item);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="certificate_${item.id}.pdf"`
    });

    res.send(pdfBuffer);
  } catch (error) {
    console.error('Certificate generation error:', error);
    res.status(500).send('Failed to generate certificate');
  }
});

export default router;
