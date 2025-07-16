import request from 'supertest';
import express from 'express';
import donatedItemRoutes from '../routes/donatedItemRoutes';
import mockPrismaClient from '../__mocks__/mockPrismaClient';
import { newProgram } from '../__mocks__/mockProgram';
import { newDonor } from '../__mocks__/mockDonor';
import {
    updateItem,
    newItem,
    newItemFormData,
    invalidItemFormData,
} from '../__mocks__/mockDonatedItem';
import jwt from 'jsonwebtoken';

const generateTestToken = (role: string = 'ADMIN') => {
    const JWT_SECRET = process.env.JWT_SECRET || 'xalngJIazn';
    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is not set in .env file!');
    }
    return jwt.sign({ id: 1, email: 'john@example.com', role }, JWT_SECRET, {
        expiresIn: '1h',
    });
};

const app = express();
app.use(express.json());
app.use('/donatedItem', donatedItemRoutes);

let adminToken: string;
beforeAll(() => {
    adminToken = generateTestToken('ADMIN');
});

describe('DonatedItem API Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Setup mock responses
        mockPrismaClient.program.findUnique.mockResolvedValue(newProgram);
        mockPrismaClient.donor.findUnique.mockResolvedValue(newDonor);
        mockPrismaClient.donatedItem.create.mockResolvedValue({
            id: 1,
            ...newItem,
        });
        mockPrismaClient.donatedItem.update.mockResolvedValue({
            id: 1,
            ...updateItem,
        });
    });

    // Test POST /donatedItem
    it('validates Program name and Donor email before creating a donated item', async () => {
        const req = request(app)
            .post('/donatedItem')
            .set('Authorization', adminToken);

        // Apply the newItemFormData to add fields and potentially files
        newItemFormData(req);
        const response = await req.expect(201);

        expect(response.status).toBe(201);
        expect(mockPrismaClient.donatedItem.create).toHaveBeenCalled();
    });

    it('handles errors when the provided Program or Donor does not exist', async () => {
        const donorId = 29;
        mockPrismaClient.program.findUnique.mockResolvedValue(null);
        mockPrismaClient.donor.findUnique.mockResolvedValue(null);

        const req = request(app)
            .post('/donatedItem')
            .set('Authorization', adminToken);
        invalidItemFormData(req);

        const response = await req.expect(400);
        expect(response.status).toBe(400);
        expect(response.body.error).toContain(
            `Donor with ID: ${donorId} does not exist.`,
        );
    });

    // Test PUT /donatedItem/details/{id}
    it('updates donated item details correctly', async () => {
        const response = await request(app)
            .put('/donatedItem/details/1')
            .set('Authorization', adminToken)
            .send(updateItem);
        expect(response.status).toBe(200);
        expect(mockPrismaClient.donatedItem.update).toHaveBeenCalled();
        expect(response.body.data.itemType).toBe(updateItem.itemType);
    });

    it('returns error responses for invalid Program or Donor values', async () => {
        mockPrismaClient.program.findUnique.mockResolvedValue(null);
        mockPrismaClient.donor.findUnique.mockResolvedValue(null);

        const donorId = 19;
        const programId = 99;

        const response = await request(app)
            .put('/donatedItem/details/1')
            .set('Authorization', adminToken)
            .send({
                ...updateItem,
                donorId,
                programId,
            });
        expect(response.status).toBe(400);
        expect(response.body.error).toContain(
            `Donor with ID: ${donorId} does not exist.`,
        );
    });
});
