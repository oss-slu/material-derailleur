import { MAX_TEXT } from '../constants/validation';

export const isTooLong = (s: string) => s.trim().length > MAX_TEXT;
export const isBlank = (s: string) => s.trim().length === 0;
export const isFormValid = (d: any) =>
  !isBlank(d.name) &&
  !isBlank(d.startDate) &&
  !isBlank(d.description) &&
  !isBlank(d.aimAndCause) &&
  !isTooLong(d.description) &&
  !isTooLong(d.aimAndCause);
