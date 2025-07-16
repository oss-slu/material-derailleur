import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import ItemStatus from '../constants/Enums';
import LoadingSpinner from './LoadingSpinner';
import '../css/AddStatus.css';

interface FormData {
    statusType: string;
    dateModified: string;
    donatedItemId: string;
}

interface FormErrors {
    [key: string]: string;
}

const AddNewStatus: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [formData, setFormData] = useState<FormData>({
        statusType: ItemStatus.DONATED,
        dateModified: '',
        donatedItemId: id || '',
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [images, setImages] = useState<File[]>([]); // Store selected images
    const [previewUrls, setPreviewUrls] = useState<string[]>([]); // Store image preview URLs
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

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
        setErrors(prevState => ({ ...prevState, [name]: '' }));
        setErrorMessage(null);
        setSuccessMessage(null);
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            if (images.length + selectedFiles.length > 5) {
                setErrorMessage('You can upload up to 5 images only.');
                return;
            }
            setImages(prev => [...prev, ...selectedFiles]);
            const newPreviewUrls = selectedFiles.map(file =>
                URL.createObjectURL(file),
            );
            setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
        }
    };

    const handleImageRemove = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    };

    const validateField = (name: string, value: any) => {
        if (!value || value.length === 0) {
            return `${name.replace(/([A-Z])/g, ' $1')} is required`;
        }
        return '';
    };
    const handlePreview = (url: string) => {
        setCurrentPreviewImage(url);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentPreviewImage(null);
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        Object.keys(formData).forEach(field => {
            const error = validateField(field, (formData as any)[field]);
            if (error) newErrors[field] = error;
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        if (validateForm()) {
            try {
                const formDataToSubmit = new FormData();
                formDataToSubmit.append('statusType', formData.statusType);
                formDataToSubmit.append('dateModified', formData.dateModified);
                formDataToSubmit.append(
                    'donatedItemId',
                    formData.donatedItemId,
                );
                images.forEach((image, index) => {
                    formDataToSubmit.append(`imageFiles`, image);
                });

                const response = await axios.post(
                    `${process.env.REACT_APP_BACKEND_API_BASE_URL}donatedItem/status/${id}`,
                    formDataToSubmit,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            Authorization: localStorage.getItem('token'),
                        },
                    },
                );

                if (response.status === 200) {
                    setSuccessMessage('Item updated successfully!');
                    handleRefresh();
                    navigate(`/donations/${id}`);
                } else {
                    setErrorMessage('Failed to update item');
                }
            } catch (error: any) {
                setErrorMessage(
                    error.response?.data?.message || 'Error updating item',
                );
            } finally {
                setIsLoading(false);
            }
        } else {
            setErrorMessage('Form has validation errors');
        }
    };

    const handleBack = () => {
        setIsLoading(true);
        navigate(`/donations/${id}`);
        setIsLoading(false);
    };

    const handleRefresh = () => {
        setIsLoading(true);
        setFormData({
            statusType: 'Received',
            dateModified: '',
            donatedItemId: '',
        });
        setImages([]);
        setPreviewUrls([]);
        setErrors({});
        setErrorMessage(null);
        setSuccessMessage(null);
        setIsLoading(false);
    };

    return (
        <div className="donor-form outer-container mx-auto p-10">
            <h1 className="text-2xl font-bold heading-centered">
                Add New Status
            </h1>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {successMessage && (
                <p className="success-message">{successMessage}</p>
            )}
            <form onSubmit={handleSubmit} className="form-grid">
                {/* Current Status Field */}
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
                                ? 'border-red-500'
                                : 'border-gray-300'
                        }`}
                    >
                        <option value={ItemStatus.DONATED}>Donated</option>
                        <option value={ItemStatus.IN_STORAGE}>
                            In storage facility
                        </option>
                        <option value={ItemStatus.REFURBISHED}>
                            Refurbished
                        </option>
                        <option value={ItemStatus.SOLD}>Item sold</option>
                        <option value={ItemStatus.RECEIVED}>Received</option>
                    </select>
                    {errors.statusType && (
                        <p className="text-red-500 text-sm mt-1">
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
                        className={`w-full px-3 py-2 rounded border ${
                            errors.dateModified
                                ? 'border-red-500'
                                : 'border-gray-300'
                        }`}
                    />
                    {errors.dateModified && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.dateModified}
                        </p>
                    )}
                </div>

                {/* Image Upload Field */}
                <div className="form-field full-width">
                    <label
                        htmlFor="imageFiles"
                        className="block text-sm font-semibold mb-1"
                    >
                        Upload Images (Max: 5)
                    </label>
                    <input
                        type="file"
                        id="imageFiles"
                        name="imageFiles"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        className="w-full px-3 py-2 rounded border border-gray-300"
                    />
                    {previewUrls.length > 0 && (
                        <div className="imagepcontainer">
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
                                {/* &times; */}
                            </span>
                            <img
                                src={currentPreviewImage}
                                alt="Full Preview"
                                className="modal-image"
                            />
                        </div>
                    </div>
                )}

                <div className="form-field full-width button-container">
                    <button
                        type="submit"
                        className="submit-button"
                        disabled={isLoading}
                    >
                        Update
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
