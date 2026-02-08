jest.mock('../prismaClient', () => require('../__mocks__/mockPrismaClient'));

import request from 'supertest';
import express, { Express } from 'express';
import { authenticateUser } from '../routes/routeProtection';
import donorRouter from '../routes/donorRoutes';
import mockPrismaClient from '../__mocks__/mockPrismaClient'; // Mock Prisma
import jwt from 'jsonwebtoken';

const generateTestToken = (role: string = 'ADMIN', expired: boolean) => {
    const JWT_SECRET = process.env.JWT_SECRET || 'xalngJIazn';
    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is not set in .env file!');
    }
    if (expired) {
        return jwt.sign(
            { id: 1, email: 'john@example.com', role },
            JWT_SECRET,
            {
                expiresIn: '-1m',
            },
        );
    } else {
        return jwt.sign(
            { id: 1, email: 'john@example.com', role },
            JWT_SECRET,
            {
                expiresIn: '1h',
            },
        );
    }
};

const app: Express = express();
app.use(express.json());

describe('General Role Based Access Tests', () => {
    let req: any;
    let res: any;
    let donorToken: string;
    let adminToken: string;
    let compromisedToken: string;
    let expiredToken: string;
    beforeAll(() => {
        donorToken = generateTestToken('DONOR', false);
        adminToken = generateTestToken('ADMIN', false);
    });

    beforeEach(() => {
        req = {
            headers: {
                authorization: '',
            },
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        jest.clearAllMocks();
        mockPrismaClient.user.findUnique.mockResolvedValue({
            status: 'ACTIVE',
        });
    });

    it('blocks users who are not signed in', async () => {
        req.headers.authorization = undefined;

        const result = await authenticateUser(req, res, true);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Authorization token missing or Access denied.',
        });
        expect(result).toBe(false);
    });

    it('blocks donors from accessing admin pages', async () => {
        req.headers.authorization = donorToken;

        const result = await authenticateUser(req, res, true);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Access denied: Admins only.',
        });
        expect(result).toBe(false);
    });

    it('blocks compromised tokens', async () => {
        compromisedToken = adminToken + 'k';
        req.headers.authorization = compromisedToken;

        const result = await authenticateUser(req, res, false);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Invalid or expired token',
        });
        expect(result).toBe(false);
    });

    it('blocks expired tokens', async () => {
        expiredToken = generateTestToken('ADMIN', true);
        req.headers.authorization = expiredToken;

        const result = await authenticateUser(req, res, true);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Invalid or expired token',
        });
        expect(result).toBe(false);
    });

    it('allows for donors to access donor pages', async () => {
        req.headers.authorization = donorToken;

        const result = await authenticateUser(req, res, false);

        expect(result).toBe(true);
        expect(res.status).not.toHaveBeenCalledWith();
        expect(res.json).not.toHaveBeenCalled();
    });

    it('allows for admins to access admin pages', async () => {
        req.headers.authorization = adminToken;

        const result = await authenticateUser(req, res, true);

        expect(result).toBe(true);
        expect(res.status).not.toHaveBeenCalledWith();
        expect(res.json).not.toHaveBeenCalled();
    });

    it('allows for admins to access donor pages', async () => {
        req.headers.authorization = adminToken;

        const result = await authenticateUser(req, res, false);

        expect(result).toBe(true);
        expect(res.status).not.toHaveBeenCalledWith();
        expect(res.json).not.toHaveBeenCalled();
    });

    it('blocks users with pending status', async () => {
        mockPrismaClient.user.findUnique.mockResolvedValue({
            status: 'PENDING',
        });
        req.headers.authorization = adminToken;

        const result = await authenticateUser(req, res, false);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Account pending approval or suspended.',
        });
        expect(result).toBe(false);
    });

    it('blocks users with suspended status', async () => {
        (mockPrismaClient.user.findUnique as jest.Mock).mockResolvedValue({
            status: 'SUSPENDED',
        });
        req.headers.authorization = donorToken;

        const result = await authenticateUser(req, res, false);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Account pending approval or suspended.',
        });
        expect(result).toBe(false);
    });
});
