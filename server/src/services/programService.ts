import prisma from '../prismaClient';

export async function validateProgram(programId: number) {
    if (!programId) return null;

    const program = await prisma.program.findUnique({
        where: { id: programId },
    });
    if (!program) {
        throw new Error(
            `Program ID ${programId} is not valid or does not exist.`,
        );
    }
    return program;
}
