import express from 'express';
import path from 'path';
import fs from 'fs';
import { generatePDF } from '../services/certificateService';
import { sendCertificateEmailWithBuffer } from '../services/emailService';

const router = express.Router();

// Route 1: Download existing certificate by donorId
router.get('/:donorId/download', (req, res) => {
    const { donorId } = req.params;

    const filePath = path.join(
        __dirname,
        '../../../certificates',
        `certificate-${donorId}.pdf`,
    );

    if (fs.existsSync(filePath)) {
        res.download(filePath);
    } else {
        res.status(404).send('Certificate not found');
    }
});

// Route 2: Generate and return certificate as PDF (download)
router.post('/generate', async (req, res) => {
    try {
        const item = req.body.item;
        const pdfBuffer = await generatePDF(item);

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="certificate_${item.id}.pdf"`,
        });

        res.send(pdfBuffer);
    } catch (error) {
        console.error('Certificate generation error:', error);
        res.status(500).send('Failed to generate certificate');
    }
});

export default router;
