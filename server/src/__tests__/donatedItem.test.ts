// Set test environment variables FIRST
process.env.GOOGLE_GEMINI_API_KEY = 'test-api-key';
process.env.JWT_SECRET = 'test-secret';
process.env.NODE_ENV = 'test';
process.env.AZURE_STORAGE_ACCOUNT_NAME = 'test-account';
process.env.AZURE_STORAGE_ACCESS_KEY = 'test-key';

// Mock// Mock authenticateUser to always return true (permission granted)
jest.mock('../routes/routeProtection', () => ({
    authenticateUser: jest.fn().mockResolvedValue(true),
}));

jest.mock('../validators/donatedItemValidator', () => ({
    donatedItemValidator: (req: any, res: any, next: any) => next(),
    authenticateUser: jest.fn().mockResolvedValue(true),
}));

// Mock Prisma
jest.mock('../prismaClient', () => ({
    __esModule: true,
    default: {
        donatedItem: {
            create: jest.fn(),
            update: jest.fn(),
            findUnique: jest.fn(),
            findMany: jest.fn(),
            delete: jest.fn(),
        },
        donatedItemStatus: {
            create: jest.fn(),
        },
        donor: {
            findUnique: jest.fn(),
        },
        program: {
            findUnique: jest.fn(),
        },
    },
}));

// Mock donor and program services
jest.mock('../services/donorService', () => ({
    validateDonor: jest.fn().mockResolvedValue(true),
}));

jest.mock('../services/programService', () => ({
    validateProgram: jest.fn().mockResolvedValue(true),
}));

// Mock donatedItem service
jest.mock('../services/donatedItemService', () => ({
    fetchImagesFromCloud: jest.fn().mockResolvedValue([]),
    validateDonatedItem: jest.fn().mockResolvedValue(true),
    validateIndividualFileSize: jest.fn(),
    uploadToStorage: jest
        .fn()
        .mockResolvedValue('http://fake-url.com/image.jpg'),
    getFileExtension: jest.fn().mockReturnValue('.jpg'),
}));

// Mock email service
jest.mock('../services/emailService', () => ({
    sendDonationEmail: jest.fn().mockResolvedValue(true),
}));

// Mock image analysis service
jest.mock('../services/imageAnalysisService', () => ({
    analyzeImageTags: jest.fn().mockResolvedValue({
        tags: [
            {
                description: 'Furniture',
                confidence: 0.95,
                category: 'item_type',
            },
        ],
        rawResponse: 'Test analysis',
        analysisTimestamp: new Date(),
        optedOut: false,
    }),
    getImageTags: jest.fn().mockResolvedValue([
        {
            description: 'Furniture',
            confidence: 0.95,
            category: 'item_type',
        },
    ]),
}));

// Mock multer
jest.mock('multer', () => {
    const multer: any = () => ({
        array: () => (req: any, res: any, next: any) => {
            req.files = [];
            next();
        },
    });
    multer.memoryStorage = jest.fn(() => ({}));
    return multer;
});

// Mock fs
jest.mock('fs', () => ({
    writeFileSync: jest.fn(),
    existsSync: jest.fn(() => false),
    unlinkSync: jest.fn(),
}));

// NOW import after all mocks
import request from 'supertest';
import express from 'express';
import donatedItemRoutes from '../routes/donatedItemRoutes';
import prisma from '../prismaClient';

const app = express();
app.use(express.json());
app.use('/api/donated-items', donatedItemRoutes);

describe('DonatedItem API Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('creates a donated item successfully', async () => {
        const mockDonor = {
            id: 1,
            email: 'donor@test.com',
            firstName: 'John',
            lastName: 'Doe',
        };
        const mockItem = {
            id: 1,
            itemType: 'Chair',
            category: 'Furniture',
            quantity: 1,
            currentStatus: 'Received',
            dateDonated: new Date(),
            donorId: 1,
            programId: 1,
            donor: mockDonor,
            statuses: [],
        };
        const mockStatus = {
            id: 1,
            statusType: 'Received',
            dateModified: new Date(),
            donatedItemId: 1,
            imageUrls: [],
        };

        (prisma.donatedItem.create as jest.Mock).mockResolvedValue(mockItem);
        (prisma.donatedItemStatus.create as jest.Mock).mockResolvedValue(
            mockStatus,
        );

        const response = await request(app).post('/api/donated-items').send({
            itemType: 'Chair',
            category: 'Furniture',
            quantity: 1,
            currentStatus: 'Received',
            donorId: 1,
            programId: 1,
            dateDonated: new Date().toISOString(),
            optOutAnalysis: 'true',
        });

        expect(response.status).toBe(201);
        expect(response.body.donatedItem).toBeDefined();
        expect(prisma.donatedItem.create).toHaveBeenCalled();
    });

    it('returns 400 when itemType is missing', async () => {
        const response = await request(app).post('/api/donated-items').send({
            category: 'Furniture',
            quantity: 1,
            donorId: 1,
            programId: 1,
        });

        expect(response.status).toBe(400);
        expect(response.body.error).toContain('itemType is required');
    });

    it('retrieves all donated items', async () => {
        const mockItems = [
            {
                id: 1,
                itemType: 'Chair',
                category: 'Furniture',
                statuses: [],
                donor: {},
                program: {},
            },
            {
                id: 2,
                itemType: 'Table',
                category: 'Furniture',
                statuses: [],
                donor: {},
                program: {},
            },
        ];

        (prisma.donatedItem.findMany as jest.Mock).mockResolvedValue(mockItems);

        const response = await request(app).get('/api/donated-items');

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(2);
    });

    it('retrieves a donated item by ID', async () => {
        const mockItem = {
            id: 1,
            itemType: 'Chair',
            category: 'Furniture',
            statuses: [],
            donor: {},
            program: {},
        };

        (prisma.donatedItem.findUnique as jest.Mock).mockResolvedValue(
            mockItem,
        );

        const response = await request(app).get('/api/donated-items/1');

        expect(response.status).toBe(200);
        expect(response.body.id).toBe(1);
    });

    it('returns 404 when item not found', async () => {
        (prisma.donatedItem.findUnique as jest.Mock).mockResolvedValue(null);

        const response = await request(app).get('/api/donated-items/999');

        expect(response.status).toBe(404);
        expect(response.body.error).toContain('not found');
    });

    it('retrieves image tags for a donated item', async () => {
        const response = await request(app).get('/api/donated-items/1/tags');

        expect(response.status).toBe(200);
        expect(response.body.tags).toBeDefined();
        expect(response.body.donatedItemId).toBe(1);
    });

    it('returns 400 for invalid ID in tags endpoint', async () => {
        const response = await request(app).get(
            '/api/donated-items/invalid/tags',
        );

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Invalid donated item ID');
    });
});
