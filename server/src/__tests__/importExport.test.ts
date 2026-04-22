process.env.JWT_SECRET = 'test-secret';
process.env.NODE_ENV = 'test';

jest.mock('../routes/routeProtection', () => ({
    authenticateUser: jest.fn().mockResolvedValue(true),
}));

jest.mock('../services/donatedItemService', () => ({
    validateIndividualFileSize: jest.fn(),
}));

jest.mock('../services/programService', () => ({
    validateProgram: jest.fn().mockResolvedValue(true),
}));

jest.mock('../prismaClient', () => ({
    __esModule: true,
    default: {
        donatedItem: {
            create: jest.fn(),
            findUnique: jest.fn(),
        },
        donatedItemStatus: {
            create: jest.fn(),
        },
        donor: {
            findUnique: jest.fn(),
            create: jest.fn(),
        },
    },
}));

import request from 'supertest';
import express from 'express';
import importExportRoutes from '../routes/importExportRoutes';
import prisma from '../prismaClient';

const app = express();
app.use(express.json());
app.use('/import-export', importExportRoutes);

describe('ImportExport API Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('imports multiple donated items from a CSV file', async () => {
        const csv = [
            'ID,Bike Name,Type,Color,Wheel Size,Donor Email',
            '101,Trek 820,MTB,Blue,26,existing@example.com',
            '102,Giant Kids,Kid,Green,20,new@example.com',
        ].join('\n');

        (prisma.donor.findUnique as jest.Mock)
            .mockResolvedValueOnce({
                id: 10,
                email: 'existing@example.com',
            })
            .mockResolvedValueOnce(null);

        (prisma.donor.create as jest.Mock).mockResolvedValue({
            id: 11,
            email: 'new@example.com',
        });

        (prisma.donatedItem.findUnique as jest.Mock).mockResolvedValue(null);

        (prisma.donatedItem.create as jest.Mock)
            .mockResolvedValueOnce({ id: 101 })
            .mockResolvedValueOnce({ id: 102 });

        (prisma.donatedItemStatus.create as jest.Mock).mockResolvedValue({});

        const response = await request(app)
            .post('/import-export/api/csv')
            .attach('csvFile', Buffer.from(csv), 'bikes.csv');

        expect(response.status).toBe(201);
        expect(response.body.importedCount).toBe(2);
        expect(response.body.failedCount).toBe(0);
        expect(prisma.donatedItem.create).toHaveBeenCalledTimes(2);
        expect(prisma.donatedItemStatus.create).toHaveBeenCalledTimes(2);

        expect(prisma.donatedItem.create).toHaveBeenNthCalledWith(
            1,
            expect.objectContaining({
                data: expect.objectContaining({
                    id: 101,
                    itemType: 'bicycle',
                    category: 'Trek 820',
                    donorId: 10,
                    attributes: {
                        create: expect.arrayContaining([
                            expect.objectContaining({
                                descriptor: 'type',
                                stringValue: 'MTB',
                            }),
                            expect.objectContaining({
                                descriptor: 'color',
                                stringValue: 'Blue',
                            }),
                            expect.objectContaining({
                                descriptor: 'wheel size (in.)',
                                numberValue: 26,
                            }),
                        ]),
                    },
                }),
            }),
        );

        expect(prisma.donatedItem.create).toHaveBeenNthCalledWith(
            2,
            expect.objectContaining({
                data: expect.objectContaining({
                    id: 102,
                    category: 'Giant Kids',
                    donorId: 11,
                }),
            }),
        );
    });
});
