import PDFDocument from 'pdfkit';
import path from 'path';
import fs from 'fs';

export async function generatePDF(item: any): Promise<Buffer> {
    const doc = new PDFDocument({
        size: 'A4',
        margin: 50
    });

    return new Promise<Buffer>((resolve, reject) => {
        const buffers: Buffer[] = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => resolve(Buffer.concat(buffers)));
        doc.on('error', reject);

        // === Background Watermark Logo ===
        const watermarkPath = path.join(__dirname, '../assets/images/bworks-logo.png');
        if (fs.existsSync(watermarkPath)) {
            doc.opacity(0.1);
            doc.image(watermarkPath, 150, 200, { width: 300, align: 'center' });
            doc.opacity(1); // reset opacity for main content
        }

        // === Top Logo ===
        const logoPath = path.join(__dirname, '../assets/images/bworks-logo.png');
        if (fs.existsSync(logoPath)) {
            doc.image(logoPath, doc.page.width / 2 - 75, 30, { width: 150 });
        }

        doc.moveDown(5);

        // === Certificate Content ===
        doc
            .fontSize(24)
            .font('Times-Bold')
            .text('Certificate of Appreciation', { align: 'center' });

        doc.moveDown(2);

        doc
            .fontSize(14)
            .font('Times-Roman')
            .text('This certificate is awarded to:', { align: 'center' });

        doc.moveDown(0.5);

        doc
            .fontSize(18)
            .font('Times-Bold')
            .text(`${item.donor?.firstName ?? 'Donor Name'}`, { align: 'center' });

        doc.moveDown(1);

        doc
            .fontSize(14)
            .font('Times-Roman')
            .text(`For generously donating: ${item.itemType}`, { align: 'center' })
            .moveDown(0.2)
            .text(`On: ${new Date(item.dateDonated).toLocaleDateString()}`, { align: 'center' });

        doc.moveDown(2);

        doc
            .fontSize(12)
            .text('We sincerely thank you for your contribution and support.', { align: 'center' });

        doc.moveDown(4);

        doc
            .fontSize(12)
            .text('Sincerely,', { align: 'right' })
            .text('St. Louis BWorks Team', { align: 'right' });

        doc.end();
    });
}
