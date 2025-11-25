import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { Readable } from 'stream';

// Keep your existing storage client (used only in azure mode)
import { storage } from '../configs/SMCloudStoreConfig';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/** Centralized config so routes/tests can flip modes via .env */
function getCfg() {
    const STORAGE_BACKEND = (
        process.env.STORAGE_BACKEND || 'azure'
    ).toLowerCase(); // 'local' | 'azure'
    const UPLOADS_DIR = process.env.UPLOADS_DIR || 'uploads';
    const PUBLIC_BASE_URL =
        process.env.PUBLIC_BASE_URL || 'http://localhost:5050';
    const AZURE_CONTAINER = process.env.AZURE_CONTAINER || 'mdma-dev';
    return { STORAGE_BACKEND, UPLOADS_DIR, PUBLIC_BASE_URL, AZURE_CONTAINER };
}

/** ISO stamp safe for Windows filenames (no colons) */
export function makeSafeStamp(d = new Date()): string {
    // 2025-11-15T18:44:20.025Z -> 2025-11-15T18-44-20.025Z
    return d.toISOString().replace(/:/g, '-');
}

/** Remove characters illegal on Windows and collapse spaces */
export function makeSafeFilename(name: string): string {
    // Strip < > : " / \ | ? *
    const stripped = name.replace(/[<>:"/\\|?*]+/g, '-');
    // Collapse whitespace
    return stripped.replace(/\s+/g, '_');
}

const guessMimeFromName = (fileName: string): string => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
        case 'jpg':
        case 'jpeg':
            return 'image/jpeg';
        case 'png':
            return 'image/png';
        case 'gif':
            return 'image/gif';
        case 'webp':
            return 'image/webp';
        default:
            return 'application/octet-stream';
    }
};

// extract file extension from MIME type
export function getFileExtension(mimeType: string) {
    switch (mimeType) {
        case 'image/jpeg':
            return '.jpeg';
        case 'image/png':
            return '.png';
        case 'image/gif':
            return '.gif';
        case 'image/webp':
            return '.webp';
        default:
            return '.jpg';
    }
}

const streamToBase64 = (stream: Readable): Promise<string | null> =>
    new Promise(resolve => {
        const chunks: Buffer[] = [];
        stream.on('data', (c: Buffer) => chunks.push(c));
        stream.on('end', () => {
            try {
                resolve(Buffer.concat(chunks).toString('base64'));
            } catch {
                resolve(null);
            }
        });
        stream.on('error', () => resolve(null));
    });

async function uploadLocal(
    file: Express.Multer.File,
    filename: string,
): Promise<string> {
    const { UPLOADS_DIR, PUBLIC_BASE_URL } = getCfg();

    // Ensure filename is safe on Windows/macOS/Linux
    const safeName = makeSafeFilename(filename);

    const absDir = path.join(process.cwd(), UPLOADS_DIR);
    const absPath = path.join(absDir, safeName);

    await fs.promises.mkdir(absDir, { recursive: true });
    await fs.promises.writeFile(absPath, file.buffer);

    // Return a public URL that matches index.ts: app.use('/uploads', express.static(...))
    return `${PUBLIC_BASE_URL}/uploads/${safeName}`;
}

async function uploadAzureViaStorage(
    file: Express.Multer.File,
    filename: string,
): Promise<string> {
    const { AZURE_CONTAINER } = getCfg();

    // Even in Azure, keep filenames safe/sanitized
    const safeName = makeSafeFilename(filename);

    // Uses your existing SMCloudStoreConfig client (shared key or temp creds must be valid)
    await storage.putObject(AZURE_CONTAINER, safeName, file.buffer, {
        'Content-Type': file.mimetype,
    });

    // Keep the historic "container/filename" shape to avoid breaking consumers
    return `${AZURE_CONTAINER}/${safeName}`;
}

/** Unified entry point used by routes */
export async function uploadToStorage(
    file: Express.Multer.File,
    filename: string,
): Promise<string> {
    const { STORAGE_BACKEND } = getCfg();
    if (STORAGE_BACKEND === 'local') {
        return uploadLocal(file, filename);
    }
    // default -> azure
    return uploadAzureViaStorage(file, filename);
}

export const validateIndividualFileSize = (
    imageFiles: Express.Multer.File[],
) => {
    for (const file of imageFiles) {
        if (file.size > MAX_FILE_SIZE) {
            throw new Error(
                `File size is too large. Max file size allowed is 5MB.`,
            );
        }
    }
};

export function validateDonatedItem(donatedItemId: number) {
    // Simple numeric guard; routes used to import this
    return Number.isInteger(donatedItemId);
}

export const fetchImagesFromCloud = async (imageUrls: string[]) => {
    const out = await Promise.all(imageUrls.map(fetchImageFromCloud));
    return out.filter((x): x is string => !!x);
};

const fetchImageFromCloud = async (url: string): Promise<string | null> => {
    try {
        const { STORAGE_BACKEND, PUBLIC_BASE_URL, UPLOADS_DIR } = getCfg();

        // LOCAL mode: full http URL: http://localhost:5050/uploads/<filename>
        if (
            STORAGE_BACKEND === 'local' &&
            url.startsWith(`${PUBLIC_BASE_URL}/uploads/`)
        ) {
            const rel = url.replace(`${PUBLIC_BASE_URL}/uploads/`, '');
            const abs = path.join(process.cwd(), UPLOADS_DIR, rel);
            const buf = await fs.promises.readFile(abs);
            const mime = guessMimeFromName(rel);
            return `data:${mime};base64,${buf.toString('base64')}`;
        }

        // AZURE mode (historic shape): "container/filename"
        if (!url.startsWith('http')) {
            const [container, file] = url.split('/');
            const stream = await storage.getObject(container, file);
            const base64 = await streamToBase64(stream);
            if (!base64) return null;
            const mime = guessMimeFromName(file);
            return `data:${mime};base64,${base64}`;
        }

        // Generic public URL (CDN, static server, etc.)
        const res = await fetch(url);
        if (!res.ok) throw new Error(`fetch failed ${res.status}`);
        const arr = new Uint8Array(await res.arrayBuffer());
        const mime =
            res.headers.get('content-type') || 'application/octet-stream';
        return `data:${mime};base64,${Buffer.from(arr).toString('base64')}`;
    } catch (e) {
        console.error('Failed to fetch or encode image:', e);
        return null;
    }
};

/**
 * Returns an array of URLs that are immediately usable by clients.
 * - In local mode: returns input URLs unchanged (they are already public http URLs)
 * - In azure mode: tries to produce a SAS URL if Azure env is present; otherwise returns raw "container/file"
 */
export const fetchSASUrls = async (imageUrls: string[]) => {
    const urls = await Promise.all(imageUrls.map(generateBlobSASUrl));
    return urls;
};

export const generateBlobSASUrl = async (url: string) => {
    const { STORAGE_BACKEND } = getCfg();

    // Local dev: URLs are already public under /uploads
    if (STORAGE_BACKEND === 'local') {
        // If caller accidentally passes "container/file" in local, just return as-is.
        return url;
    }

    // Azure mode — only attempt if we truly have account + key
    const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
    const accountKey = process.env.AZURE_STORAGE_ACCESS_KEY;

    if (!accountName || !accountKey) {
        // No credentials available — return raw path to avoid throwing
        return url;
    }

    // Lazy-require Azure SDK to avoid bundling when unused
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const {
        BlobServiceClient,
        StorageSharedKeyCredential,
        generateBlobSASQueryParameters,
        BlobSASPermissions,
    } = require('@azure/storage-blob');

    const [containerName, fileName] = url.includes('/')
        ? url.split('/', 2)
        : [process.env.AZURE_CONTAINER || 'mdma-dev', url];

    const sharedKeyCredential = new StorageSharedKeyCredential(
        accountName,
        accountKey,
    );
    const blobServiceClient = new BlobServiceClient(
        `https://${accountName}.blob.core.windows.net`,
        sharedKeyCredential,
    );
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(fileName);

    const expiryTime = new Date();
    expiryTime.setDate(expiryTime.getDate() + 30); // 30 days

    const sasOptions = {
        containerName,
        blobName: fileName,
        permissions: BlobSASPermissions.parse('r'),
        expiresOn: expiryTime,
    };

    const sasToken = generateBlobSASQueryParameters(
        sasOptions,
        sharedKeyCredential,
    ).toString();
    return `${blobClient.url}?${sasToken}`;
};

export const upload = multer({
    storage: multer.memoryStorage(),
    limits: { files: 5 },
});
