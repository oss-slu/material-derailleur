import {
    validateRequiredField,
    validateDate,
    validateImages,
    validateStatusForm,
} from '../Components/AddNewStatus';

describe('AddNewStatus Validation', () => {
    // Helper function to create mock files
    const createMockFile = (name: string, type: string, size: number): File => {
        return new File([new ArrayBuffer(size)], name, { type });
    };

    describe('validateRequiredField', () => {
        it('should return error for empty string', () => {
            const result = validateRequiredField('', 'Test Field');
            expect(result).toBe('Test Field is required.');
        });

        it('should return error for whitespace only', () => {
            const result = validateRequiredField('   ', 'Test Field');
            expect(result).toBe('Test Field is required.');
        });

        it('should return empty string for valid value', () => {
            const result = validateRequiredField('valid value', 'Test Field');
            expect(result).toBe('');
        });
    });

    describe('validateDate', () => {
        it('should return error for empty date', () => {
            const result = validateDate('');
            expect(result).toBe('This field is required.');
        });

        it('should return error for future date', () => {
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + 1);
            const result = validateDate(futureDate.toISOString().split('T')[0]);
            expect(result).toBe('');
        });

        it('should return empty string for valid past date', () => {
            const pastDate = new Date('2023-01-01');
            const result = validateDate(pastDate.toISOString().split('T')[0]);
            expect(result).toBe('');
        });

        it("should return empty string for today's date", () => {
            const today = new Date().toISOString().split('T')[0];
            const result = validateDate(today);
            expect(result).toBe('');
        });

        it('should return error for invalid date format', () => {
            const result = validateDate('invalid-date');
            expect(result).toBe(
                'Invalid date format. Please use YYYY-MM-DD format.',
            );
        });
    });

    // ----------------------------
    // validateImages
    // ----------------------------
    describe('validateImages', () => {
        it('should return error for too many images', () => {
            const mockImages = Array(6)
                .fill(null)
                .map((_, i) =>
                    createMockFile(`test${i}.jpg`, 'image/jpeg', 1000000),
                );
            const result = validateImages(mockImages);
            expect(result.isValid).toBe(false);
            expect(result.errors.general).toBe(
                'You can upload up to 5 images only.',
            );
        });

        it('should return error for invalid file type', () => {
            const mockImages = [
                createMockFile('test.pdf', 'application/pdf', 1000000),
            ];
            const result = validateImages(mockImages);
            expect(result.isValid).toBe(false);
            expect(result.errors['image_0']).toContain(
                'is not a valid image type',
            );
        });

        it('should return error for file too large', () => {
            const mockImages = [
                createMockFile('large.jpg', 'image/jpeg', 3 * 1024 * 1024),
            ];
            const result = validateImages(mockImages);
            expect(result.isValid).toBe(false);
            expect(result.errors['image_0']).toContain(
                'exceeds the 2MB size limit',
            );
        });

        it('should return valid for correct images', () => {
            const mockImages = [
                createMockFile('test1.jpg', 'image/jpeg', 1000000),
                createMockFile('test2.png', 'image/png', 1500000),
            ];
            const result = validateImages(mockImages);
            expect(result.isValid).toBe(true);
            expect(result.errors).toEqual({});
        });
    });

    // ----------------------------
    // validateStatusForm
    // ----------------------------
    describe('validateStatusForm', () => {
        const baseFormData = {
            statusType: 'DONATED',
            dateModified: '2023-01-01',
            donatedItemId: '123',
        };

        it('should return errors for empty form data', () => {
            const emptyFormData = {
                statusType: '',
                dateModified: '',
                donatedItemId: '',
            };
            const result = validateStatusForm(emptyFormData, []);
            expect(result.statusType).toBe('Status type is required.');
            expect(result.dateModified).toBe('This field is required.');
            expect(result.donatedItemId).toBe('Donated item ID is required.');
        });

        it('should return no errors for valid form data', () => {
            const result = validateStatusForm(baseFormData, []);
            expect(result).toEqual({});
        });

        it('should combine field errors with image errors', () => {
            const invalidFormData = {
                statusType: '',
                dateModified: '2023-01-01',
                donatedItemId: '123',
            };
            const mockImages = [
                createMockFile('test.pdf', 'application/pdf', 1000000),
            ];
            const result = validateStatusForm(invalidFormData, mockImages);
            expect(result.statusType).toBe('Status type is required.');
            expect(result['image_0']).toContain('is not a valid image type');
        });

        it('should allow maximum allowed images', () => {
            const mockImages = Array(5)
                .fill(null)
                .map((_, i) =>
                    createMockFile(`test${i}.jpg`, 'image/jpeg', 1000000),
                );
            const result = validateStatusForm(baseFormData, mockImages);
            expect(result).toEqual({});
        });
    });
});
