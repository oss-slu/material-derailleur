import { isTooLong, isBlank, isFormValid } from '../constants/programValChecks';
import { MAX_TEXT } from '../constants/validation';

describe('program validation utils', () => {
  it('detects blank strings correctly', () => {
    expect(isBlank('')).toBe(true);
    expect(isBlank('  ')).toBe(true);
    expect(isBlank('Hello')).toBe(false);
  });

  it('detects too long strings', () => {
    const longStr = 'a'.repeat(MAX_TEXT + 1);
    expect(isTooLong(longStr)).toBe(true);
  });

  it('validates program object', () => {
    const valid = {
      name: 'Program',
      description: 'desc',
      startDate: '2025-10-17',
      aimAndCause: 'cause',
    };
    expect(isFormValid(valid)).toBe(true);
  });
});
