// Mock Prisma BEFORE any other imports
jest.mock('../prismaClient', () => require('../__mocks__/mockPrismaClient'));

// Mock authenticateUser to check role from JWT token
jest.mock('../routes/routeProtection', () => ({
    authenticateUser: jest.fn(
        async (req: any, res: any, adminOnly: boolean = false) => {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                res.status(401).json({ message: 'No token provided' });
                return false;
            }

            const token = authHeader.replace('Bearer ', '');
            const jwt = require('jsonwebtoken');
            const JWT_SECRET = process.env.JWT_SECRET || 'xalngJIazn';

            try {
                const decoded = jwt.verify(token, JWT_SECRET) as any;
                req.user = decoded;

                // If adminOnly is true, check if user is ADMIN
                if (adminOnly && decoded.role !== 'ADMIN') {
                    res.status(403).json({
                        message: 'Access denied: Admins only.',
                    });
                    return false;
                }

                return true;
            } catch (error) {
                res.status(401).json({ message: 'Invalid token' });
                return false;
            }
        },
    ),
}));

// Mock email service to prevent timeouts
jest.mock('../services/emailService', () => ({
    sendWelcomeEmail: jest.fn().mockResolvedValue(undefined),
}));

import request from 'supertest';
import express, { Express } from 'express';
import donorRouter from '../routes/donorRoutes';
import prisma from '../prismaClient';
import jwt from 'jsonwebtoken';

// Get the mocked prisma client
const mockPrismaClient = prisma as jest.Mocked<typeof prisma>;

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
        jest.clearAllMocks();
    });

    afterAll(async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
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

        (mockPrismaClient.donor.create as jest.Mock).mockResolvedValue({
            id: 1,
            ...newDonor,
        });

        const response = await request(app)
            .post('/donor')
            .set('Authorization', `Bearer ${adminToken}`)
            .send(newDonor)
            .expect(201)
            .expect('Content-Type', /json/);

        expect(response.body).toHaveProperty('id');
        expect(response.body.firstName).toBe('John');
        expect(mockPrismaClient.donor.create).toHaveBeenCalledTimes(1);
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

        (mockPrismaClient.donor.create as jest.Mock).mockRejectedValue(
            new Error('Database error'),
        );

        const response = await request(app)
            .post('/donor')
            .set('Authorization', `Bearer ${adminToken}`)
            .send(newDonor)
            .expect(500);

        expect(response.body.message).toBe('Error creating donor');
        expect(mockPrismaClient.donor.create).toHaveBeenCalled();
    });

    it('should get all donors', async () => {
        (mockPrismaClient.donor.findMany as jest.Mock).mockResolvedValue([
            {
                id: 1,
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                contact: '1234567890',
                addressLine1: '123 Main St',
                state: 'Missouri',
                city: 'St. Louis',
                zipcode: '63108',
                emailOptIn: false,
            },
        ]);

        const response = await request(app)
            .get('/donor')
            .set('Authorization', `Bearer ${adminToken}`)
            .expect(200)
            .expect('Content-Type', /json/);

        expect(response.body).toHaveLength(1);
        expect(response.body[0].firstName).toBe('John');
        expect(mockPrismaClient.donor.findMany).toHaveBeenCalled();
    });

    it('should handle errors when fetching donors', async () => {
        (mockPrismaClient.donor.findMany as jest.Mock).mockRejectedValue(
            new Error('Database error'),
        );

        const response = await request(app)
            .get('/donor')
            .set('Authorization', `Bearer ${adminToken}`)
            .expect(500);

        expect(response.body.message).toBe('Error fetching donors');
    });

    it('should return list of donor emails for admin', async () => {
        (mockPrismaClient.donor.findMany as jest.Mock).mockResolvedValue([
            {
                id: 1,
                email: 'john@example.com',
                firstName: 'John',
                lastName: 'Doe',
                contact: '1234567890',
                addressLine1: '123 Main St',
                state: 'Missouri',
                city: 'St. Louis',
                zipcode: '63108',
                emailOptIn: false,
            },
            {
                id: 2,
                email: 'jane@example.com',
                firstName: 'Jane',
                lastName: 'Smith',
                contact: '0987654321',
                addressLine1: '456 Oak Ave',
                state: 'Missouri',
                city: 'Kansas City',
                zipcode: '64101',
                emailOptIn: true,
            },
        ]);

        const response = await request(app)
            .get('/donor/emails')
            .set('Authorization', `Bearer ${adminToken}`)
            .expect(200)
            .expect('Content-Type', /json/);

        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body).toEqual(['john@example.com', 'jane@example.com']);
        expect(mockPrismaClient.donor.findMany).toHaveBeenCalled();
    });

    it('should return 403 if user is not admin', async () => {
        const response = await request(app)
            .get('/donor/emails')
            .set('Authorization', `Bearer ${donorToken}`)
            .expect(403);

        expect(response.body.message).toBe('Access denied: Admins only.');
    });

    it('should handle errors when fetching donor emails', async () => {
        (mockPrismaClient.donor.findMany as jest.Mock).mockRejectedValue(
            new Error('Database error'),
        );

        const response = await request(app)
            .get('/donor/emails')
            .set('Authorization', `Bearer ${adminToken}`)
            .expect(500);

        expect(response.body.message).toBe('Error fetching donor emails');
    });
});
