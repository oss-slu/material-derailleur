import multer from 'multer';
import { storage } from '../configs/SMCloudStoreConfig';
const {
    BlobServiceClient,
    StorageSharedKeyCredential,
    generateBlobSASQueryParameters,
    BlobSASPermissions,
} = require('@azure/storage-blob');
import prisma from '../prismaClient';
import { Readable } from 'stream';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // Max file size limit: 5MB

export async function uploadToStorage(file: Express.Multer.File, filename: string): Promise<string> {
    const containerName = 'mdma-dev';
    console.log(`Uploading file "${filename}" to container "${containerName}"...`);
    await storage.putObject(containerName, filename, file.buffer, {
        'Content-Type': file.mimetype,
    });
    console.log(`Upload complete for "${filename}"`);
    return `${containerName}/${filename}`;
}


//  Validate each file size (Max 5MB)
export const validateIndividualFileSize = (
    imageFiles: Express.Multer.File[],
) => {
    console.log('Validating individual file sizes');
    for (const file of imageFiles) {
        if (file.size > MAX_FILE_SIZE) {
            throw new Error(
                `File size is too large. Max file size allowed is 5MB.`,
            );
        }
    }
};

export const fetchImagesFromCloud = async (imageUrls: string[]) => {
    const encodedImages = await Promise.all(
        imageUrls.map(imageUrl => fetchImageFromCloud(imageUrl)),
    );
    return encodedImages.filter((e): e is string => e !== null);
};

const fetchImageFromCloud = async (url: string): Promise<string | null> => {
    try {
        console.log('Fetching image', url);
        const url_chunks = url.split('/');
        const containerName = url_chunks[0];
        const fileName = url_chunks[1];
        const stream = await storage.getObject(containerName, fileName);
        const base64Image = await streamToBase64(stream);
        if (!base64Image) {
            return null;
        }

        const mimeType = getMimeType(fileName);
        return `data:${mimeType};base64,${base64Image}`;
    } catch (error) {
        console.error('Failed to fetch or encode image:', error);
        return null;
    }
};
const getMimeType = (fileName: string): string => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
        case 'jpg':
        case 'jpeg':
            return 'image/jpeg';
        case 'png':
            return 'image/png';
        case 'gif':
            return 'image/gif';
        default:
            return 'image/jpeg'; // Default MIME type
    }
};

export const fetchSASUrls = async (imageUrls: string[]) => {
    const sasUrls = await Promise.all(
        imageUrls.map(async url => {
            return await generateBlobSASUrl(url);
        }),
    );

    return sasUrls;
};

export const generateBlobSASUrl = async (url: string) => {
    const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
    const sharedKeyCredential = new StorageSharedKeyCredential(
        accountName,
        process.env.AZURE_STORAGE_ACCESS_KEY,
    );
    const blobServiceClient = new BlobServiceClient(
        `https://${accountName}.blob.core.windows.net`,
        sharedKeyCredential,
    );
    const url_chunks = url.split('/');
    const containerName = url_chunks[0];
    const fileName = url_chunks[1];
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(fileName);

    // Set SAS expiration time to 30 days from now
    const expiryTime = new Date();
    expiryTime.setDate(expiryTime.getDate() + 30);

    const sasOptions = {
        containerName,
        fileName,
        permissions: BlobSASPermissions.parse('r'), // Read-only access
        expiresOn: expiryTime,
    };
    

    // Generate SAS token
    const sasToken = generateBlobSASQueryParameters(
        sasOptions,
        sharedKeyCredential,
    ).toString();
    return `${blobClient.url}?${sasToken}`;
};

const streamToBase64 = (stream: Readable): Promise<string | null> => {
    return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        stream.on('data', (chunk: Buffer) => {
            chunks.push(chunk);
        });
        stream.on('end', () => {
            const buffer = Buffer.concat(chunks);
            const base64 = buffer.toString('base64');
            resolve(base64);
        });
        stream.on('error', error => {
            console.error('Stream error:', error);
            resolve(null); // Resolve with null in case of an error
        });
    });
};

//extract file extension from MIME type
export function getFileExtension(mimeType: string) {
    switch (mimeType) {
        case 'image/jpeg':
            return '.jpeg';
        case 'image/png':
            return '.png';
        case 'image/gif':
            return '.gif';
        default:
            return '.jpg';
    }
}

export function validateDonatedItem(donatedItemId: number) {
    // Check if donatedItemId is a valid number (integer)
    if (isNaN(donatedItemId)) {
        return false;
    } else {
        return true;
    }
}
