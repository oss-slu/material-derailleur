process.env.JWT_SECRET = 'test-secret';
process.env.NODE_ENV = 'test';

jest.mock('../routes/routeProtection', () => ({
    authenticateUser: jest.fn().mockResolvedValue(true),
}));

jest.mock('../prismaClient', () => ({
    __esModule: true,
    default: {
        donatedItemStatus: {
            findMany: jest.fn(),
            updateMany: jest.fn(),
            update: jest.fn(),
        },
        donatedItem: {
            findUnique: jest.fn(),
        },
    },
}));

jest.mock('../services/emailService', () => ({
    sendDonationUpdateEmail: jest.fn().mockResolvedValue(true),
}));

import request from 'supertest';
import express from 'express';
import donatedItemStatusRoutes from '../routes/donatedItemStatusRoutes';
import prisma from '../prismaClient';
import { sendDonationUpdateEmail } from '../services/emailService';

const app = express();
app.use(express.json());
app.use('/donatedItem/status', donatedItemStatusRoutes);

describe('Donated Item Status Scheduling', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('schedules approved emails instead of sending them immediately', async () => {
        const scheduledTime = '2026-10-08T18:00:00.000Z';

        const pendingStatuses = [
            {
                id: 1,
                donatedItemId: 10,
                statusType: 'Received',
                dateModified: new Date(),
                imageUrls: [],
                donorInformed: true,
                approval: false,
            },
        ];

        (prisma.donatedItemStatus.findMany as jest.Mock).mockResolvedValue(
            pendingStatuses,
        );

        (prisma.donatedItemStatus.updateMany as jest.Mock).mockResolvedValue({
            count: 1,
        });

        const response = await request(app)
            .put('/donatedItem/status/review/approve-all')
            .send({
                scheduledSendTime: scheduledTime,
            });

        expect(response.status).toBe(200);

        expect(prisma.donatedItemStatus.updateMany).toHaveBeenCalledWith({
            where: { approval: false },
            data: {
                approval: true,
                scheduledSendAt: new Date(scheduledTime),
                emailSent: false,
            },
        });

        expect(sendDonationUpdateEmail).not.toHaveBeenCalled();
    });

    it('sends approved emails immediately when no scheduled time is provided', async () => {
        const pendingStatuses = [
            {
                id: 1,
                donatedItemId: 10,
                statusType: 'Received',
                dateModified: new Date(),
                imageUrls: [],
                donorInformed: true,
                approval: false,
            },
        ];

        const mockDonatedItem = {
            id: 10,
            donor: {
                email: 'donor@test.com',
                firstName: 'Test',
                lastName: 'Donor',
            },
        };

        (prisma.donatedItemStatus.findMany as jest.Mock).mockResolvedValue(
            pendingStatuses,
        );

        (prisma.donatedItemStatus.updateMany as jest.Mock).mockResolvedValue({
            count: 1,
        });

        (prisma.donatedItem.findUnique as jest.Mock).mockResolvedValue(
            mockDonatedItem,
        );

        (prisma.donatedItemStatus.update as jest.Mock).mockResolvedValue({});

        const response = await request(app)
            .put('/donatedItem/status/review/approve-all')
            .send({});

        expect(response.status).toBe(200);

        expect(prisma.donatedItemStatus.updateMany).toHaveBeenCalledWith({
            where: { approval: false },
            data: {
                approval: true,
                scheduledSendAt: null,
                emailSent: false,
            },
        });

        expect(sendDonationUpdateEmail).toHaveBeenCalledTimes(1);

        expect(prisma.donatedItemStatus.update).toHaveBeenCalledWith({
            where: { id: 1 },
            data: { emailSent: true },
        });
    });
});
