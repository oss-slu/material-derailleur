import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error('DATABASE_URL must be set before Prisma is initialized');
}

const prisma =
    new PrismaClient({
        adapter: new PrismaPg({ connectionString }),
    });

export default prisma;
