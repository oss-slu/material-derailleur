// prismaClient.ts
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/prisma';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error('DATABASE_URL must be set before Prisma is initialized');
}

const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
});

export default prisma;
