import prisma from '../prismaClient';
import { NotFoundError } from './NotFoundError';

export async function validateProgram(programId: number) {
    if (!programId) {
        throw new NotFoundError('Program ID is required.');
    }

    const program = await prisma.program.findUnique({
        where: { id: programId },
    });
    if (!program) {
        throw new NotFoundError(
            `Program ID ${programId} is not valid or does not exist.`,
        );
    }
    return program;
}
