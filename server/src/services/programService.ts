import prisma from '../prismaClient'; // Adjust the import path as necessary

export async function validateProgram(programId: number) {
    const program = await prisma.program.findUnique({
        where: { id: programId }
    });
    if (!program) {
        throw new Error(`Program ID ${programId} is not valid or does not exist.`);
    }
    return program;
}
