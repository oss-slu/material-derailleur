import request from 'supertest';
import express, { Express } from 'express';
import donorRouter from '../routes/donorRoutes';
import mockPrismaClient from '../__mocks__/mockPrismaClient'; // Mock Prisma
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

const app: Express = express();
app.use(express.json());
app.use('/donor', donorRouter);

describe('Donor API', () => {
    let adminToken: string;
    let donorToken: string;
    beforeAll(() => {
        adminToken = generateTestToken('ADMIN');
        donorToken = generateTestToken('DONOR');
    });
    beforeEach(() => {
        jest.clearAllMocks(); // Clear mocks before each test to avoid interference
    });

    it('should create a new donor', async () => {
        const newDonor = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            contact: '1234567890',
            addressLine1: '123 Main St',
            state: 'Missouri',
            city: 'St. Louis',
            zipcode: '63108',
            emailOptIn: false,
        };

        mockPrismaClient.donor.create.mockResolvedValue({
            id: 1,
            ...newDonor,
            role: 'ADMIN',
        });

        const response = await request(app)
            .post('/donor')
            .set('Authorization', adminToken)
            .send(newDonor)
            .expect(201)
            .expect('Content-Type', /json/);

        expect(response.body).toHaveProperty('id');
        expect(response.body.firstName).toBe('John');
        expect(mockPrismaClient.donor.create).toHaveBeenCalledTimes(1);
        expect(mockPrismaClient.donor.create).toHaveBeenCalledWith({
            data: { ...newDonor },
        });
    }, 10000);

    it('should handle errors when creating a donor', async () => {
        const newDonor = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            contact: '1234567890',
            addressLine1: '123 Main St',
            state: 'Missouri',
            city: 'St. Louis',
            zipcode: '63101',
            emailOptIn: false,
        };

        mockPrismaClient.donor.create.mockRejectedValue(
            new Error('Database error'),
        );

        const response = await request(app)
            .post('/donor')
            .set('Authorization', adminToken)
            .send(newDonor)
            .expect(500);

        expect(response.body.message).toBe('Error creating donor');
        expect(mockPrismaClient.donor.create).toHaveBeenCalled();
    });

    it('should get all donors', async () => {
        mockPrismaClient.donor.findMany.mockResolvedValue([
            {
                id: 1,
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
            },
        ]);

        const response = await request(app)
            .get('/donor')
            .set('Authorization', adminToken)
            .expect(200)
            .expect('Content-Type', /json/);

        expect(response.body).toHaveLength(1);
        expect(response.body[0].firstName).toBe('John');
        expect(mockPrismaClient.donor.findMany).toHaveBeenCalled();
    });

    it('should handle errors when fetching donors', async () => {
        mockPrismaClient.donor.findMany.mockRejectedValue(
            new Error('Database error'),
        );

        const response = await request(app)
            .get('/donor')
            .set('Authorization', adminToken)
            .expect(500);

        expect(response.body.message).toBe('Error fetching donors');
    });

    it('should return list of donor emails for admin', async () => {
        mockPrismaClient.donor.findMany.mockResolvedValue([
            { email: 'john@example.com' },
            { email: 'jane@example.com' },
        ]);

        const response = await request(app)
            .get('/donor/emails')
            .set('Authorization', adminToken)
            .expect(200)
            .expect('Content-Type', /json/);

        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body).toEqual(['john@example.com', 'jane@example.com']);
        expect(mockPrismaClient.donor.findMany).toHaveBeenCalled();
    });

    it('should return 403 if user is not admin', async () => {
        const response = await request(app)
            .get('/donor/emails')
            .set('Authorization', donorToken)
            .expect(403);

        expect(response.body.message).toBe('Access denied: Admins only.');
    });

    it('should handle errors when fetching donor emails', async () => {
        mockPrismaClient.donor.findMany.mockRejectedValue(
            new Error('Database error'),
        );

        const response = await request(app)
            .get('/donor/emails')
            .set('Authorization', adminToken)
            .expect(500);

        expect(response.body.message).toBe('Error fetching donor emails');
    });
});
