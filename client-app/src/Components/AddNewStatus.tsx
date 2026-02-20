import React, {
    useState,
    useEffect,
    ChangeEvent,
    FormEvent,
    useCallback,
} from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import ItemStatus from '../constants/Enums';
import LoadingSpinner from './LoadingSpinner';
import '../css/AddStatus.css';

interface FormData {
    statusType: string;
    dateModified: string;
    donatedItemId: string;
    informDonor: boolean | string; // Accept both boolean and string for checkbox value
}

interface FormErrors {
    [key: string]: string;
}

interface ImageValidationResult {
    isValid: boolean;
    errors: FormErrors;
}

const VALIDATION_RULES = {
    REQUIRED_FIELD: 'This field is required.',
    INVALID_DATE: 'Date cannot be in the future.',
    MAX_IMAGES: 5,
    MAX_FILE_SIZE: 2 * 1024 * 1024,
    ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/jpg'] as const,
} as const;

export const validateRequiredField = (
    value: string,
    fieldName: string,
): string => {
    if (!value || value.trim() === '') {
        return `${fieldName} is required.`;
    }
    return '';
};

export const validateDate = (dateString: string): string => {
    if (!dateString) return VALIDATION_RULES.REQUIRED_FIELD;

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateString)) {
        return 'Invalid date format. Please use YYYY-MM-DD format.';
    }
    const selectedDate = new Date(dateString);
    if (isNaN(selectedDate.getTime())) {
        return 'Invalid date. Please enter a valid date.';
    }
    const today = new Date(dateString);
    today.setHours(23, 59, 59, 999);

    if (selectedDate > today) {
        return VALIDATION_RULES.INVALID_DATE;
    }

    return '';
};

export const validateImages = (images: File[]): ImageValidationResult => {
    const errors: FormErrors = {};

    if (images.length > VALIDATION_RULES.MAX_IMAGES) {
        errors.general = `You can upload up to ${VALIDATION_RULES.MAX_IMAGES} images only.`;
        return { isValid: false, errors };
    }

    images.forEach((image, index) => {
        if (!VALIDATION_RULES.ALLOWED_FILE_TYPES.includes(image.type as any)) {
            errors[`image_${index}`] =
                `${image.name} is not a valid image type. Only JPG, JPEG and PNG are allowed.`;
        } else if (image.size > VALIDATION_RULES.MAX_FILE_SIZE) {
            errors[`image_${index}`] =
                `${image.name} exceeds the ${VALIDATION_RULES.MAX_FILE_SIZE / 1024 / 1024}MB size limit.`;
        }
    });

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};

// Main validation function
export const validateStatusForm = (
    formData: FormData,
    images: File[],
): FormErrors => {
    const errors: FormErrors = {};

    // Validate required fields
    const statusTypeError = validateRequiredField(
        formData.statusType,
        'Status type',
    );
    if (statusTypeError) errors.statusType = statusTypeError;

    const dateModifiedError = validateDate(formData.dateModified);
    if (dateModifiedError) errors.dateModified = dateModifiedError;

    const donatedItemIdError = validateRequiredField(
        formData.donatedItemId,
        'Donated item ID',
    );
    if (donatedItemIdError) errors.donatedItemId = donatedItemIdError;

    // Validate images
    const imageValidation = validateImages(images);
    Object.assign(errors, imageValidation.errors);

    return errors;
};

const AddNewStatus: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [formData, setFormData] = useState<FormData>({
        statusType: ItemStatus.DONATED,
        dateModified: '',
        donatedItemId: id || '',
        informDonor: false,
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [images, setImages] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPreviewImage, setCurrentPreviewImage] = useState<
        string | null
    >(null);

    useEffect(() => {
        if (id) {
            setFormData(prev => ({ ...prev, donatedItemId: id }));
        }
    }, [id]);

    // Clean up object URLs on unmount
    useEffect(() => {
        return () => {
            previewUrls.forEach(url => URL.revokeObjectURL(url));
        };
    }, [previewUrls]);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value, type } = e.target;

        // Handle checkbox inputs
        const isCheckbox = type === 'checkbox';
        const fieldValue = isCheckbox
            ? (e.target as HTMLInputElement).checked
            : value;

        // Clear specific field error when user starts typing
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[name];
            return newErrors;
        });

        setFormData(prev => ({ ...prev, [name]: fieldValue }));
        setErrorMessage(null);
        setSuccessMessage(null);
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const selectedFiles = Array.from(e.target.files);

        // Clear previous image errors
        setErrors(prev => {
            const newErrors = { ...prev };
            Object.keys(newErrors).forEach(key => {
                if (key.startsWith('image_') || key === 'general') {
                    delete newErrors[key];
                }
            });
            return newErrors;
        });

        // Validate before adding images
        const newImages = [...images, ...selectedFiles];
        const imageValidation = validateImages(newImages);

        if (!imageValidation.isValid) {
            setErrors(prev => ({ ...prev, ...imageValidation.errors }));
            e.target.value = '';
            return;
        }

        setImages(newImages);

        // Create preview URLs
        const newPreviewUrls = selectedFiles.map(file =>
            URL.createObjectURL(file),
        );
        setPreviewUrls(prev => [...prev, ...newPreviewUrls]);

        e.target.value = ''; // Reset file input
    };

    const handleImageRemove = (index: number) => {
        // Revoke the object URL to prevent memory leaks
        URL.revokeObjectURL(previewUrls[index]);

        setImages(prev => prev.filter((_, i) => i !== index));
        setPreviewUrls(prev => prev.filter((_, i) => i !== index));

        // Clear related errors
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[`image_${index}`];

            // Reindex remaining image errors
            Object.keys(newErrors).forEach(key => {
                if (key.startsWith('image_')) {
                    const oldIndex = parseInt(key.split('_')[1]);
                    if (oldIndex > index) {
                        const newKey = `image_${oldIndex - 1}`;
                        newErrors[newKey] = newErrors[key];
                        delete newErrors[key];
                    }
                }
            });

            return newErrors;
        });
    };

    const handlePreview = (url: string) => {
        setCurrentPreviewImage(url);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentPreviewImage(null);
    };

    const validateForm = useCallback((): boolean => {
        const validationErrors = validateStatusForm(formData, images);
        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    }, [formData, images]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        if (!validateForm()) {
            setErrorMessage(
                'Please fix the validation errors before submitting.',
            );
            setIsLoading(false);
            return;
        }

        try {
            const formDataToSubmit = new FormData();
            formDataToSubmit.append('statusType', formData.statusType);
            formDataToSubmit.append('dateModified', formData.dateModified);
            formDataToSubmit.append(
                'informDonor',
                formData.informDonor.toString(),
            );
            formDataToSubmit.append('donatedItemId', formData.donatedItemId);
            images.forEach(image =>
                formDataToSubmit.append('imageFiles', image),
            );

            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_API_BASE_URL}donatedItem/status/${id}`,
                formDataToSubmit,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: localStorage.getItem('token') || '',
                    },
                },
            );

            if (response.status === 200) {
                setSuccessMessage('Status updated successfully!');
                setTimeout(() => {
                    navigate(`/donations/${id}`);
                }, 2000);
            } else {
                setErrorMessage('Failed to update status');
            }
        } catch (error: any) {
            const errorMsg =
                error.response?.data?.message ||
                error.response?.data?.error ||
                'Error updating status';
            setErrorMessage(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        navigate(`/donations/${id}`);
    };

    const handleRefresh = () => {
        // Clean up existing preview URLs
        previewUrls.forEach(url => URL.revokeObjectURL(url));

        setFormData({
            statusType: ItemStatus.DONATED,
            dateModified: '',
            donatedItemId: id || '',
            informDonor: false,
        });
        setImages([]);
        setPreviewUrls([]);
        setErrors({});
        setErrorMessage(null);
        setSuccessMessage(null);
    };

    return (
        <div className="donor-form outer-container mx-auto p-10">
            <h1 className="text-2xl font-bold heading-centered">
                Add New Status
            </h1>

            {/* Global Error Message */}
            {errorMessage && (
                <div className="error-message mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {errorMessage}
                </div>
            )}

            {/* Global Success Message */}
            {successMessage && (
                <div className="success-message mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                    {successMessage}
                </div>
            )}

            <form onSubmit={handleSubmit} className="form-grid" noValidate>
                {/* Status Field */}
                <div className="form-field">
                    <label
                        htmlFor="statusType"
                        className="block text-sm font-semibold mb-1"
                    >
                        Current Status<span className="text-red-500"> *</span>
                    </label>
                    <select
                        id="statusType"
                        name="statusType"
                        value={formData.statusType}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 rounded border ${
                            errors.statusType
                                ? 'border-red-500 bg-red-50'
                                : 'border-gray-300'
                        }`}
                        aria-describedby={
                            errors.statusType ? 'statusType-error' : undefined
                        }
                        aria-invalid={!!errors.statusType}
                    >
                        <option value={ItemStatus.RECEIVED}>Received</option>
                        <option value={ItemStatus.DONATED}>Donated</option>
                        <option value={ItemStatus.IN_STORAGE}>
                            In storage facility
                        </option>
                        <option value={ItemStatus.REFURBISHED}>
                            Refurbished
                        </option>
                        <option value={ItemStatus.SOLD}>Item sold</option>
                    </select>
                    {errors.statusType && (
                        <p
                            id="statusType-error"
                            className="text-red-500 text-sm mt-1"
                            role="alert"
                        >
                            {errors.statusType}
                        </p>
                    )}
                </div>

                {/* Date Updated Field */}
                <div className="form-field">
                    <label
                        htmlFor="dateModified"
                        className="block text-sm font-semibold mb-1"
                    >
                        Date Updated<span className="text-red-500"> *</span>
                    </label>
                    <input
                        type="date"
                        id="dateModified"
                        name="dateModified"
                        value={formData.dateModified}
                        onChange={handleChange}
                        max={new Date().toISOString().split('T')[0]} // Prevent future dates
                        className={`w-full px-3 py-2 rounded border ${
                            errors.dateModified
                                ? 'border-red-500 bg-red-50'
                                : 'border-gray-300'
                        }`}
                        aria-describedby={
                            errors.dateModified
                                ? 'dateModified-error'
                                : undefined
                        }
                        aria-invalid={!!errors.dateModified}
                    />
                    {errors.dateModified && (
                        <p
                            id="dateModified-error"
                            className="text-red-500 text-sm mt-1"
                            role="alert"
                        >
                            {errors.dateModified}
                        </p>
                    )}
                </div>

                {/* Inform Donor Checkbox */}
                <div className="form-field full-width">
                    <label className="inline-flex items-center">
                        <input
                            type="checkbox"
                            name="informDonor"
                            checked={!!formData.informDonor}
                            onChange={handleChange}
                            className="form-checkbox h-5 w-5 text-blue-600"
                        />
                        <span className="ml-2 text-sm">
                            Inform donor about this status update
                        </span>
                    </label>
                </div>

                {/* Image Upload Field */}
                <div className="form-field full-width">
                    <label
                        htmlFor="imageFiles"
                        className="block text-sm font-semibold mb-1"
                    >
                        Upload Images (Max: {VALIDATION_RULES.MAX_IMAGES},
                        JPG/PNG only, Max{' '}
                        {VALIDATION_RULES.MAX_FILE_SIZE / 1024 / 1024}MB each)
                    </label>
                    <input
                        type="file"
                        id="imageFiles"
                        name="imageFiles"
                        accept="image/jpeg, image/jpg, image/png"
                        multiple
                        onChange={handleImageChange}
                        disabled={images.length >= VALIDATION_RULES.MAX_IMAGES}
                        className="w-full px-3 py-2 rounded border border-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                    {images.length >= VALIDATION_RULES.MAX_IMAGES && (
                        <p className="text-amber-600 text-sm mt-1">
                            Maximum number of images (
                            {VALIDATION_RULES.MAX_IMAGES}) reached.
                        </p>
                    )}

                    {/* Image Validation Errors */}
                    {Object.keys(errors)
                        .filter(
                            key =>
                                key.startsWith('image_') || key === 'general',
                        )
                        .map(key => (
                            <p
                                key={key}
                                className="text-red-500 text-sm mt-1"
                                role="alert"
                            >
                                {errors[key]}
                            </p>
                        ))}

                    {previewUrls.length > 0 && (
                        <div className="imagepcontainer mt-3">
                            {previewUrls.map((url, index) => (
                                <div key={index} className="imagepreview">
                                    <img
                                        src={url}
                                        alt={`Preview ${index + 1}`}
                                        className="thumbnail"
                                    />
                                    <div className="image-actions">
                                        <button
                                            type="button"
                                            className="preview-button"
                                            onClick={() => handlePreview(url)}
                                        >
                                            Preview
                                        </button>
                                        <button
                                            type="button"
                                            className="removeimage"
                                            onClick={() =>
                                                handleImageRemove(index)
                                            }
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Modal for Image Preview */}
                {isModalOpen && currentPreviewImage && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <span className="pclosebutton" onClick={closeModal}>
                                Close
                            </span>
                            <img
                                src={currentPreviewImage}
                                alt="Full Preview"
                                className="modal-image"
                            />
                        </div>
                    </div>
                )}

                {/* Buttons */}
                <div className="form-field full-width button-container">
                    <button
                        type="submit"
                        className="submit-button"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Updating...' : 'Update'}
                    </button>
                    <button
                        type="button"
                        onClick={handleRefresh}
                        className="refresh-button"
                        disabled={isLoading}
                    >
                        Refresh
                    </button>
                    <button
                        type="button"
                        onClick={handleBack}
                        className="back-button"
                        disabled={isLoading}
                    >
                        Back
                    </button>
                </div>

                {isLoading && <LoadingSpinner />}
            </form>
        </div>
    );
};

export default AddNewStatus;
