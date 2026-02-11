const mockPrismaClient = {
    donor: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
    },
    program: {
        findUnique: jest.fn(),
    },
    donatedItem: {
        create: jest.fn(),
        update: jest.fn(),
        findUnique: jest.fn(),
    },
    donatedItemStatus: {
        create: jest.fn(),
    },
    user: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    },
};

export default mockPrismaClient;
