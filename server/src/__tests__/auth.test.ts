// mock BEFORE imports
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../services/emailService'); // Add this mock
jest.mock('../configs/SMCloudStoreConfig', () => ({
    storage: {
        putObject: jest.fn(),
        getObject: jest.fn(),
    },
}));
process.env.JWT_SECRET = process.env.JWT_SECRET || 'xalngJIazn';

import request from 'supertest';
import express, { Express } from 'express';
import programRoutes from '../routes/programRoutes';
import prisma from '../prismaClient';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as emailService from '../services/emailService'; // Import email service

// Mock prisma AFTER importing real
jest.mock('../prismaClient', () => require('../__mocks__/mockPrismaClient'));

process.env.JWT_SECRET = 'test_jwt_secret';

const app: Express = express();
app.use(express.json());
app.use('/api/auth', programRoutes);

const mockedPrisma = prisma as unknown as {
    user: {
        findUnique: jest.Mock;
        create: jest.Mock;
        update: jest.Mock;
    };
};

const mockedBcrypt = bcrypt as unknown as {
    hash: jest.Mock<Promise<string>, [string, number]>;
    compare: jest.Mock<Promise<boolean>, [string, string]>;
};

const mockedJwt = jwt as unknown as {
    sign: jest.Mock<string, [any, string, jwt.SignOptions?]>;
};

const mockedEmailService = emailService as jest.Mocked<typeof emailService>;

beforeEach(() => {
    jest.clearAllMocks();
});

describe('Auth Routes', () => {
    // ===================== SIGNUP ===========================
    describe('POST /api/auth/register', () => {
        it('should register a user successfully', async () => {
            mockedPrisma.user.findUnique.mockResolvedValue(null); // No existing user
            mockedBcrypt.hash.mockResolvedValue('hashedPassword');
            mockedPrisma.user.create.mockResolvedValue({ id: '123' });

            const res = await request(app).post('/api/auth/register').send({
                name: 'Test User',
                email: 'test@example.com',
                password: 'securepass',
            });

            expect(res.status).toBe(201);
            expect(res.body.message).toBe('User registered successfully');
            expect(res.body.userId).toBe('123');
            expect(mockedBcrypt.hash).toHaveBeenCalled();
        });

        it('should fail when email is invalid', async () => {
            const res = await request(app).post('/api/auth/register').send({
                name: 'Test',
                email: 'invalidemail',
                password: 'securepass',
            });

            expect(res.status).toBe(400);
        });

        it('should fail when password is weak', async () => {
            const res = await request(app).post('/api/auth/register').send({
                name: 'Test',
                email: 'test@example.com',
                password: '123',
            });

            expect(res.status).toBe(400);
        });

        it('should fail when email already exists', async () => {
            mockedPrisma.user.findUnique.mockResolvedValue({
                id: 'existing-user',
            });

            const res = await request(app).post('/api/auth/register').send({
                name: 'Test',
                email: 'existing@example.com',
                password: 'securepass',
            });

            expect(res.status).toBe(400);
            expect(res.body.message).toBe('Email already in use');
        });
    });

    // ===================== LOGIN ===========================
    describe('POST /api/auth/login', () => {
        it('should login user successfully', async () => {
            mockedPrisma.user.findUnique.mockResolvedValue({
                id: 'user123',
                email: 'test@example.com',
                password: 'hashedPassword',
                name: 'Test User',
                role: 'ADMIN',
                firstLogin: false,
                resetToken: null,
                resetTokenExpiry: null,
            });

            mockedBcrypt.compare.mockResolvedValue(true);
            mockedJwt.sign.mockReturnValue('mocked-jwt-token');

            const res = await request(app).post('/api/auth/login').send({
                email: 'test@example.com',
                password: 'securepass',
            });

            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Login successful');
            expect(res.body.token).toBe('mocked-jwt-token');
        });

        it('should fail when email is invalid format', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({ email: 'invalidemail', password: 'securepass' });

            expect(res.status).toBe(400);
        });

        it('should fail when email not found', async () => {
            mockedPrisma.user.findUnique.mockResolvedValue(null);

            const res = await request(app).post('/api/auth/login').send({
                email: 'notfound@example.com',
                password: 'securepass',
            });

            expect(res.status).toBe(401);
        });

        it('should fail with incorrect password', async () => {
            mockedPrisma.user.findUnique.mockResolvedValue({
                id: 'user123',
                email: 'test@example.com',
                password: 'hashedPassword',
                name: 'Test User',
                role: 'ADMIN',
                firstLogin: false,
                resetToken: null,
                resetTokenExpiry: null,
            });

            mockedBcrypt.compare.mockResolvedValue(false);

            const res = await request(app)
                .post('/api/auth/login')
                .send({ email: 'test@example.com', password: 'wrongpass' });

            expect(res.status).toBe(401);
        });

        it('should force password reset if firstLogin is true', async () => {
            mockedPrisma.user.findUnique.mockResolvedValue({
                id: 'user123',
                email: 'donor@example.com',
                password: 'hashedPassword',
                name: 'Donor User',
                role: 'DONOR',
                firstLogin: true,
                resetToken: null,
                resetTokenExpiry: null,
            });

            mockedBcrypt.compare.mockResolvedValue(true);

            // Mock the update to return the user with reset token
            mockedPrisma.user.update.mockResolvedValue({
                id: 'user123',
                email: 'donor@example.com',
                password: 'hashedPassword',
                name: 'Donor User',
                role: 'DONOR',
                firstLogin: true,
                resetToken: 'mocked-reset-token',
                resetTokenExpiry: new Date(Date.now() + 3600000),
            });

            // Mock email service to avoid timeout
            if (mockedEmailService.sendPasswordReset) {
                mockedEmailService.sendPasswordReset.mockResolvedValue(
                    undefined,
                );
            }

            const res = await request(app)
                .post('/api/auth/login')
                .send({ email: 'donor@example.com', password: 'securepass' });

            expect(res.status).toBe(403);
            expect(res.body.requireReset).toBe(true);
            expect(mockedPrisma.user.update).toHaveBeenCalled();
        }, 10000); // Increase timeout to 10 seconds for this test
    });
});
