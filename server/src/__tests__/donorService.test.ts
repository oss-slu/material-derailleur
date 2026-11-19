
import { describe, it, expect, vi, beforeEach } from 'vitest';
import prisma from '../prismaClient';
import { validateDonor } from '../services/donorService';
import { NotFoundError } from '../services/NotFoundError';

vi.mock('../prismaClient', () => ({
  default: {
    donor: {
      findUnique: vi.fn(),
    },
  },
}));

describe('validateDonor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return donor when donor exists', async () => {
    const mockDonor = {
      id: 1,
      name: 'John',
    };

    vi.mocked(prisma.donor.findUnique).mockResolvedValue(mockDonor as any);

    const result = await validateDonor(1);

    expect(result).toEqual(mockDonor);
    expect(prisma.donor.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it('should throw NotFoundError when donor ID is missing', async () => {
    await expect(validateDonor(0)).rejects.toThrow(NotFoundError);

    expect(prisma.donor.findUnique).not.toHaveBeenCalled();
  });

  it('should throw NotFoundError when donor does not exist', async () => {
    vi.mocked(prisma.donor.findUnique).mockResolvedValue(null);

    await expect(validateDonor(999)).rejects.toThrow(NotFoundError);
  });
});
