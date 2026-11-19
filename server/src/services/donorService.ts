import prisma from '../prismaClient';
import { NotFoundError } from './NotFoundError';

export async function validateDonor(donorId: number) {
    if (!donorId) {
        throw new NotFoundError('Donor ID is required.');
    }

    const donor = await prisma.donor.findUnique({
        where: { id: donorId },
    });
    if (!donor) {
        throw new NotFoundError(`Donor with ID: ${donorId} does not exist.`);
    }
    return donor;
}
