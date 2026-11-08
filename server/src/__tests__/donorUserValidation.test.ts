jest.mock('../prismaClient', () => ({
    __esModule: true,
    default: {
        user: { findUnique: jest.fn(), update: jest.fn() },
        donor: { findUnique: jest.fn(), create: jest.fn() },
        $transaction: jest.fn(),
    },
}));
jest.mock('../routes/routeProtection', () => ({
    authenticateUser: jest.fn().mockResolvedValue(true),
}));
jest.mock('../services/emailService', () => ({
    sendAccountUpdateEmail: jest.fn().mockResolvedValue(undefined),
}));
jest.mock('../services/donatedItemService', () => ({
    fetchImagesFromCloud: jest.fn(),
}));

import express from 'express';
import request from 'supertest';
import prisma from '../prismaClient';
import donorRouter from '../routes/donorRoutes';

const app = express();
app.use(express.json());
app.use('/donor', donorRouter);

const details = { firstName: 'Jane', lastName: 'Doe', zipcode: '63108' };

beforeEach(() => {
    jest.clearAllMocks();
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'user-1', email: 'jane@example.com', role: 'ADMIN', status: 'ACTIVE',
    });
    (prisma.donor.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.user.update as jest.Mock).mockResolvedValue({
        email: 'jane@example.com', name: 'Jane Doe', role: 'DONOR', status: 'ACTIVE',
    });
    (prisma.$transaction as jest.Mock).mockImplementation(callback => callback(prisma));
});

describe('donor profile validation during role changes', () => {
    test.each(['firstName', 'lastName', 'zipcode'] as const)(
        'rejects invalid %s values before writing', async field => {
            const maxLength = field === 'zipcode' ? 20 : 50;
            for (const value of [undefined, null, 123, {}, [], '', '   ', 'x'.repeat(maxLength + 1)]) {
                const response = await request(app)
                    .put('/donor/users/user-1')
                    .send({ role: 'DONOR', donorDetails: { ...details, [field]: value } });

                expect(response.status).toBe(400);
            }
            expect(prisma.$transaction).not.toHaveBeenCalled();
            expect(prisma.donor.create).not.toHaveBeenCalled();
            expect(prisma.user.update).not.toHaveBeenCalled();
        },
    );

    test('rejects missing donor details', async () => {
        const response = await request(app)
            .put('/donor/users/user-1').send({ role: 'DONOR' });
        expect(response.status).toBe(400);
        expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    test('accepts trimmed values at the schema length limits', async () => {
        const boundaryDetails = {
            firstName: 'a'.repeat(50), lastName: 'b'.repeat(50), zipcode: '1'.repeat(20),
        };
        const response = await request(app).put('/donor/users/user-1').send({
            role: 'DONOR',
            donorDetails: Object.fromEntries(
                Object.entries(boundaryDetails).map(([key, value]) => [key, ` ${value} `]),
            ),
        });
        expect(response.status).toBe(200);
        expect(prisma.donor.create).toHaveBeenCalledWith({
            data: { ...boundaryDetails, email: 'jane@example.com', emailOptIn: false },
        });
    });

    test('reuses an existing profile without requiring donor details', async () => {
        (prisma.donor.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
        const response = await request(app)
            .put('/donor/users/user-1').send({ role: 'DONOR' });
        expect(response.status).toBe(200);
        expect(prisma.donor.create).not.toHaveBeenCalled();
        expect(prisma.user.update).toHaveBeenCalled();
    });

    test('creates a missing profile for an existing DONOR user', async () => {
        (prisma.user.findUnique as jest.Mock).mockResolvedValue({
            id: 'user-1',
            email: 'jane@example.com',
            role: 'DONOR',
            status: 'ACTIVE',
        });

        const response = await request(app)
            .put('/donor/users/user-1')
            .send({ role: 'DONOR', donorDetails: details });

        expect(response.status).toBe(200);
        expect(prisma.donor.create).toHaveBeenCalledTimes(1);
        expect(prisma.donor.create).toHaveBeenCalledWith({
            data: {
                ...details,
                email: 'jane@example.com',
                emailOptIn: false,
            },
        });
    });

});
