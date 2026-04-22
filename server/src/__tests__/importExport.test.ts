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
            findMany: jest.fn(),
        },
        donatedItemStatus: {
            create: jest.fn(),
        },
        donor: {
            findUnique: jest.fn(),
            create: jest.fn(),
        },
        itemAttribute: {
            groupBy: jest.fn(),
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

    it('exports a CSV file with fixed item columns and dynamic attribute headers', async () => {
        (prisma.itemAttribute.groupBy as jest.Mock).mockResolvedValue([
            { descriptor: 'color' },
            { descriptor: 'type' },
            { descriptor: 'wheel size (in.)' },
            { descriptor: 'standover height (in.)' },
            { descriptor: 'condition' },
        ]);

        (prisma.donatedItem.findMany as jest.Mock).mockResolvedValue([
            {
                id: 101,
                itemType: 'bicycle',
                category: 'Trek 820',
                quantity: 1,
                currentStatus: 'Received',
                dateDonated: new Date('2026-04-22T00:00:00.000Z'),
                programId: null,
                donor: { email: 'existing@example.com' },
                attributes: [
                    { descriptor: 'type', stringValue: 'MTB' },
                    { descriptor: 'color', stringValue: 'Blue' },
                    {
                        descriptor: 'wheel size (in.)',
                        numberValue: 26,
                    },
                    {
                        descriptor: 'standover height (in.)',
                        numberValue: 18,
                    },
                    { descriptor: 'condition', stringValue: 'Good' },
                ],
            },
        ]);

        const response = await request(app).get('/import-export/api/csv');

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toContain('text/csv');
        expect(response.headers['content-disposition']).toContain(
            'donated-items-export.csv',
        );

        const [headerLine, dataLine] = response.text.trim().split('\n');

        expect(headerLine).toContain('"ID"');
        expect(headerLine).toContain('"Item Type"');
        expect(headerLine).toContain('"Item Name"');
        expect(headerLine).toContain('"Quantity"');
        expect(headerLine).toContain('"Current Status"');
        expect(headerLine).toContain('"Date Donated"');
        expect(headerLine).toContain('"Donor Email"');
        expect(headerLine).toContain('"Program ID"');
        expect(headerLine).toContain('"color"');
        expect(headerLine).toContain('"type"');
        expect(headerLine).toContain('"wheel size (in.)"');
        expect(headerLine).toContain('"standover height (in.)"');
        expect(headerLine).toContain('"condition"');

        expect(dataLine).toContain('"101"');
        expect(dataLine).toContain('"bicycle"');
        expect(dataLine).toContain('"Trek 820"');
        expect(dataLine).toContain('"1"');
        expect(dataLine).toContain('"Received"');
        expect(dataLine).toContain('"2026-04-22T00:00:00.000Z"');
        expect(dataLine).toContain('"MTB"');
        expect(dataLine).toContain('"Blue"');
        expect(dataLine).toContain('"26"');
        expect(dataLine).toContain('"existing@example.com"');
        expect(dataLine).toContain('""');
        expect(dataLine).toContain('"18"');
        expect(dataLine).toContain('"Good"');
    });

    it('can import the exact CSV produced by the export route', async () => {
        (prisma.itemAttribute.groupBy as jest.Mock).mockResolvedValue([
            { descriptor: 'color' },
            { descriptor: 'type' },
            { descriptor: 'wheel size (in.)' },
            { descriptor: 'standover height (in.)' },
        ]);

        (prisma.donatedItem.findMany as jest.Mock).mockResolvedValue([
            {
                id: 201,
                itemType: 'bicycle',
                category: 'Round Trip Bike',
                quantity: 1,
                currentStatus: 'Received',
                dateDonated: new Date('2026-04-22T00:00:00.000Z'),
                programId: null,
                donor: { email: 'roundtrip@example.com' },
                attributes: [
                    { descriptor: 'type', stringValue: 'Road' },
                    { descriptor: 'color', stringValue: 'Red' },
                    {
                        descriptor: 'wheel size (in.)',
                        numberValue: 27,
                    },
                    {
                        descriptor: 'standover height (in.)',
                        numberValue: 20,
                    },
                ],
            },
        ]);

        const exportResponse = await request(app).get('/import-export/api/csv');

        expect(exportResponse.status).toBe(200);

        (prisma.donor.findUnique as jest.Mock).mockResolvedValue({
            id: 20,
            email: 'roundtrip@example.com',
        });

        (prisma.donatedItem.findUnique as jest.Mock).mockResolvedValue(null);
        (prisma.donatedItem.create as jest.Mock).mockResolvedValue({ id: 201 });
        (prisma.donatedItemStatus.create as jest.Mock).mockResolvedValue({});

        const importResponse = await request(app)
            .post('/import-export/api/csv')
            .attach(
                'csvFile',
                Buffer.from(exportResponse.text, 'utf8'),
                'roundtrip.csv',
            );

        expect(importResponse.status).toBe(201);
        expect(importResponse.body.importedCount).toBe(1);
        expect(importResponse.body.failedCount).toBe(0);
        expect(prisma.donatedItem.create).toHaveBeenCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({
                    id: 201,
                    category: 'Round Trip Bike',
                    donorId: 20,
                    attributes: {
                        create: expect.arrayContaining([
                            expect.objectContaining({
                                descriptor: 'type',
                                stringValue: 'Road',
                            }),
                            expect.objectContaining({
                                descriptor: 'color',
                                stringValue: 'Red',
                            }),
                            expect.objectContaining({
                                descriptor: 'wheel size (in.)',
                                numberValue: 27,
                            }),
                            expect.objectContaining({
                                descriptor: 'standover height (in.)',
                                numberValue: 20,
                            }),
                        ]),
                    },
                }),
            }),
        );
    });

    it('returns failed row details when import partially succeeds', async () => {
        const csv = [
            'ID,Bike Name,Type,Color,Wheel Size,Donor Email',
            '301,Valid Bike,Road,Blue,27,valid@example.com',
            '302,,Road,Green,26,missing-category@example.com',
        ].join('\n');

        (prisma.donor.findUnique as jest.Mock).mockResolvedValue({
            id: 30,
            email: 'valid@example.com',
        });

        (prisma.donatedItem.findUnique as jest.Mock).mockResolvedValue(null);
        (prisma.donatedItem.create as jest.Mock).mockResolvedValue({ id: 301 });
        (prisma.donatedItemStatus.create as jest.Mock).mockResolvedValue({});

        const response = await request(app)
            .post('/import-export/api/csv')
            .attach('csvFile', Buffer.from(csv), 'partial-success.csv');

        expect(response.status).toBe(207);
        expect(response.body.message).toBe(
            'CSV import completed with some errors',
        );
        expect(response.body.importedCount).toBe(1);
        expect(response.body.failedCount).toBe(1);
        expect(response.body.failedRows).toEqual([
            {
                rowNumber: 3,
                error: 'CSV row is missing Bike Name for category',
            },
        ]);
    });

    it('returns failed row details with 207 when all import rows fail', async () => {
        const csv = [
            'ID,Bike Name,Type,Color,Wheel Size,Donor Email',
            '401,,Road,Blue,27,missing-category@example.com',
            '0,Invalid Id Bike,Road,Green,26,invalid-id@example.com',
        ].join('\n');

        const response = await request(app)
            .post('/import-export/api/csv')
            .attach('csvFile', Buffer.from(csv), 'all-failed.csv');

        expect(response.status).toBe(207);
        expect(response.body.message).toBe(
            'CSV import completed with some errors',
        );
        expect(response.body.importedCount).toBe(0);
        expect(response.body.failedCount).toBe(2);
        expect(response.body.failedRows).toEqual([
            {
                rowNumber: 2,
                error: 'CSV row is missing Bike Name for category',
            },
            {
                rowNumber: 3,
                error: 'CSV row is missing a valid numeric id',
            },
        ]);
    });
});
