import mockPrismaClient from '../__mocks__/mockPrismaClient';
jest.mock('../prismaClient', () => mockPrismaClient);

import { validateProgram } from '../services/programService';

describe('validateProgram', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return null if programId is not provided', async () => {
    const result = await validateProgram(null as unknown as number);
    expect(result).toBeNull();
  });

  it('should return the program object if programId is valid', async () => {
    const mockProgram = { id: 1, name: 'Test Program' };
    (mockPrismaClient.program.findUnique as jest.Mock).mockResolvedValue(mockProgram);

    const result = await validateProgram(1);

    expect(result).toEqual(mockProgram);
    expect(mockPrismaClient.program.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it('should throw an error if programId is invalid', async () => {
    (mockPrismaClient.program.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(validateProgram(999)).rejects.toThrow(
      'Program ID 999 is not valid or does not exist.'
    );

    expect(mockPrismaClient.program.findUnique).toHaveBeenCalledWith({
      where: { id: 999 },
    });
  });
});
