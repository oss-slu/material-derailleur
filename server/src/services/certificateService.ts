import PDFDocument from 'pdfkit';
import path from 'path';
import fs from 'fs';
import {
    BlobServiceClient,
    StorageSharedKeyCredential,
} from '@azure/storage-blob';

// Helper: download image from Azure as Buffer
async function downloadImageFromAzure(
    containerName: string,
    blobName: string,
): Promise<Buffer> {
const accountName = process.env.AZURE_STORAGE_ACCOUNT!;
const accountKey = process.env.AZURE_STORAGE_ACCESS_KEY!;

    const sharedKeyCredential = new StorageSharedKeyCredential(
        accountName,
        accountKey,
    );
    
    const blobServiceClient = new BlobServiceClient(
        `https://${accountName}.blob.core.windows.net`,
        sharedKeyCredential,
    );

    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(blobName);

    const downloadBlockBlobResponse = await blobClient.download();
    const chunks: Uint8Array[] = [];
    return new Promise((resolve, reject) => {
        if (!downloadBlockBlobResponse.readableStreamBody) {
            return reject(new Error('No readable stream in Azure response'));
        }
        downloadBlockBlobResponse.readableStreamBody.on('data', data => {
            chunks.push(data);
        });
        downloadBlockBlobResponse.readableStreamBody.on('end', () => {
            resolve(Buffer.concat(chunks));
        });
        downloadBlockBlobResponse.readableStreamBody.on('error', reject);
    });
}

export async function generatePDF(item: any): Promise<Buffer> {
    console.log('generatePDF called with item:', item);

    const doc = new PDFDocument({
        size: 'A4',
        margin: 50,
    });

    return new Promise<Buffer>(async (resolve, reject) => {
        const buffers: Buffer[] = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => resolve(Buffer.concat(buffers)));
        doc.on('error', reject);

        // === Background Watermark Logo ===
        const watermarkPath = path.join(
            __dirname,
            '../assets/images/bworks-logo.png',
        );
        if (fs.existsSync(watermarkPath)) {
            doc.opacity(0.1);
            doc.image(watermarkPath, 150, 200, { width: 300, align: 'center' });
        }
        doc.opacity(1);

        // === Top Logo ===
        const logoPath = path.join(
            __dirname,
            '../assets/images/bworks-logo.png',
        );
        if (fs.existsSync(logoPath)) {
            doc.image(logoPath, doc.page.width / 2 - 75, 20, { width: 150 });
        }

        doc.moveDown(6); // move content below logo

        // === Certificate Title ===
        doc.fontSize(24)
            .font('Times-Bold')
            .text('Certificate of Appreciation', { align: 'center' });

        doc.moveDown(2);

        // === Donor Information ===
        doc.fontSize(14)
            .font('Times-Roman')
            .text('This certificate is awarded to:', { align: 'center' });

        doc.moveDown(0.5);

        doc.fontSize(18)
            .font('Times-Bold')
            .text(`${item.donor?.firstName ?? 'Donor Name'}`, {
                align: 'center',
            });

        doc.moveDown(1);

        // === Donation Details ===
        doc.fontSize(14)
            .font('Times-Roman')
            .text(`For generously donating: ${item.itemType}`, {
                align: 'center',
            })
            .moveDown(0.2)
            .text(
                `On: ${new Date(item.dateDonated).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                })}`,
                { align: 'center' },
            );

        doc.moveDown(2);

        // === Appreciation Message ===
        doc.fontSize(12).text(
            'We sincerely thank you for your contribution and support.',
            { align: 'center' },
        );

        doc.moveDown(5);

        // === Signature ===
        doc.fontSize(12)
            .text('Sincerely,', { align: 'right' })
            .text('St. Louis BWorks Team', { align: 'right' });

        // --- Add new page for photo ---
        doc.addPage();

        doc.fontSize(20).text('Donated Item Photo', {
            align: 'center',
            underline: true,
        });
        doc.moveDown(2);

        try {
            // Extract photo URL from nested structure safely
            const photoUrl =
                item.statuses &&
                item.statuses.length > 0 &&
                item.statuses[0].imageUrls &&
                item.statuses[0].imageUrls.length > 0
                    ? item.statuses[0].imageUrls[0]
                    : null;

            if (!photoUrl || typeof photoUrl !== 'string') {
                console.warn('Photo URL is missing or invalid:', photoUrl);
                doc.fontSize(14).text('No photo available', { align: 'center' });
                doc.end();
                return;
            }

            // photoUrl example: 'mdma-dev/item-2025-06-13T03:54:36.525Z-11.png'
            const [containerName, ...blobParts] = photoUrl.split('/');
            const blobName = blobParts.join('/');

            const photoBuffer = await downloadImageFromAzure(
                containerName,
                blobName,
            );

            doc.image(photoBuffer, doc.page.width / 2 - 150, 100, {
                width: 300,
                align: 'center',
            });
        } catch (err) {
            console.error('Error fetching photo from Azure:', err);
            doc.fontSize(14).text('No photo available', { align: 'center' });
        }

        doc.end();
    });
}
