process.env.NODE_ENV = 'test';
process.env.SMTP_HOST = 'test-host';
process.env.SMTP_PORT = '587';
process.env.SMTP_USER = 'test@test.com';
process.env.SMTP_PASS = 'test-password';

const mockTransporter = {
    verify: jest.fn(),
    sendMail: jest.fn(),
    close: jest.fn(),
};

// Mock Prisma
jest.mock('../prismaClient', () => ({
    __esModule: true,
    default: {
        donatedItemStatus: {
            findMany: jest.fn(),
            update: jest.fn(),
        },
        donatedItem: {
            findUnique: jest.fn(),
        },
    },
}));

// Mock donated item service
jest.mock('../services/donatedItemService', () => ({
    fetchSASUrls: jest.fn().mockResolvedValue([]),
}));

// Mock Nodemailer so no real email is sent
jest.mock('nodemailer', () => ({
    __esModule: true,
    default: {
        createTransport: jest.fn(() => mockTransporter),
    },
}));

import prisma from '../prismaClient';
import { processScheduledDonationEmails } from '../services/emailService';

describe('Scheduled Donation Emails', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        mockTransporter.sendMail.mockResolvedValue({
            messageId: 'test-message',
        });
    });

    it('sends a due scheduled email and marks it as sent', async () => {
        const dueStatus = {
            id: 1,
            donatedItemId: 10,
            statusType: 'Received',
            dateModified: new Date('2026-10-07T12:00:00.000Z'),
            imageUrls: [],
            donorInformed: true,
            approval: true,
            scheduledSendAt: new Date('2026-10-07T13:00:00.000Z'),
            emailSent: false,
        };

        const donatedItem = {
            id: 10,
            donor: {
                email: 'donor@test.com',
                firstName: 'Test',
                lastName: 'Donor',
            },
        };

        (prisma.donatedItemStatus.findMany as jest.Mock).mockResolvedValue([
            dueStatus,
        ]);

        (prisma.donatedItem.findUnique as jest.Mock).mockResolvedValue(
            donatedItem,
        );

        (prisma.donatedItemStatus.update as jest.Mock).mockResolvedValue({});

        await processScheduledDonationEmails();

        expect(prisma.donatedItemStatus.findMany).toHaveBeenCalledWith({
            where: {
                approval: true,
                donorInformed: true,
                emailSent: false,
                scheduledSendAt: {
                    not: null,
                    lte: expect.any(Date),
                },
            },
        });

        expect(prisma.donatedItem.findUnique).toHaveBeenCalledWith({
            where: { id: 10 },
            include: { donor: true },
        });

        expect(mockTransporter.sendMail).toHaveBeenCalledTimes(1);

        expect(prisma.donatedItemStatus.update).toHaveBeenCalledWith({
            where: { id: 1 },
            data: { emailSent: true },
        });
    });
});
