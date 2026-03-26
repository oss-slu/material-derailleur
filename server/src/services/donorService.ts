import prisma from '../prismaClient';

export async function validateDonor(donorId: number) {
    const donor = await prisma.donor.findUnique({
        where: { id: donorId },
    });
    if (!donor) {
        throw new Error(`Donor with ID: ${donorId} does not exist.`);
    }
    return donor;
}
