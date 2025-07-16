import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import '../css/DonorForm.css'; // We should probably make a new CSS for this form in the future

interface FormData {
    itemType: string;
    currentStatus: string;
    donorId: number | null;
    programId: number | null;
    dateDonated: string;
    imageFiles: File[];
}

interface FormErrors {
    [key: string]: string;
}

interface Option {
    value: string;
    label: string;
    id?: number;
}

const NewItemForm: React.FC = () => {
    const maxImageSize = 5 * 1024 * 1024; // 5MB

    const navigate = useNavigate();
    const [formData, setFormData] = useState<FormData>({
        itemType: '',
        currentStatus: 'Received',
        donorId: null,
        programId: null,
        imageFiles: [],
        dateDonated: '',
    });

    const itemTypeOptions: Option[] = [
        { value: 'bicycle', label: 'Bicycle' },
        { value: 'computer', label: 'Computer' },
    ];

    const [donorEmailOptions, setDonorEmailOptions] = useState<Option[]>([]);
    const [programOptions, setProgramOptions] = useState<Option[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [errors, setErrors] = useState<FormErrors>({});
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchDonorEmails = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_BACKEND_API_BASE_URL}donor`,
                    {
                        headers: {
                            Authorization: localStorage.getItem('token'),
                        },
                    },
                );
                const emailOptions = response.data.map((donor: any) => ({
                    value: donor.id,
                    label: donor.email,
                    id: donor.id,
                }));
                setDonorEmailOptions(emailOptions);
            } catch (error) {
                console.error('Error fetching donor emails:', error);
            }
        };

        const fetchPrograms = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_BACKEND_API_BASE_URL}program`,
                    {
                        headers: {
                            Authorization: localStorage.getItem('token'),
                        },
                    },
                );
                const programOptions = response.data.map((program: any) => ({
                    value: program.id,
                    label: program.name,
                    id: program.id,
                }));
                setProgramOptions(programOptions);
            } catch (error) {
                console.error('Error fetching programs:', error);
            }
        };

        fetchDonorEmails();
        fetchPrograms();
    }, []);

    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    };

    const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const fileArray = Array.from(files);
            fileArray.filter(file => {
                if (file.size > maxImageSize) {
                    setErrorMessage(
                        `File size too large: ${file.name} (Max: 5MB)`,
                    );
                    scrollToError();
                }
            });
            if ([...formData.imageFiles, ...fileArray].length > 6) {
                setErrorMessage(
                    `Too many images uploaded. Please remove ${[...formData.imageFiles, ...fileArray].length - 5} images`,
                );
                scrollToError();
            } else if ([...formData.imageFiles, ...fileArray].length > 5) {
                setErrorMessage(
                    `Too many images uploaded. Please remove ${[...formData.imageFiles, ...fileArray].length - 5} image`,
                );
                scrollToError();
            }
            setFormData(prevState => ({
                ...prevState,
                imageFiles: [...prevState.imageFiles, ...fileArray],
            }));

            // Creating previews for display
            const filePreviews = await Promise.all(
                fileArray.map(file => {
                    return new Promise<string>((resolve, reject) => {
                        const reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onload = () => resolve(reader.result as string);
                        reader.onerror = error => reject(error);
                    });
                }),
            );

            setPreviews(prev => [...prev, ...filePreviews]);
        }
    };

    const removeImage = (index: number) => {
        const updatedFiles = formData.imageFiles.filter((_, i) => i !== index);
        const updatedPreviews = previews.filter((_, i) => i !== index);
        setFormData(prevState => ({
            ...prevState,
            imageFiles: updatedFiles,
        }));
        setPreviews(updatedPreviews);
        const oversizedFile = updatedFiles.find(
            file => file.size > maxImageSize,
        );
        if (oversizedFile) {
            setErrorMessage(
                `File size too large: ${oversizedFile.name} (Max: 5MB)`,
            );
            scrollToError();
        } else if (updatedFiles.length > 6) {
            setErrorMessage(
                `Too many images uploaded. Please remove ${updatedFiles.length - 5} images`,
            );
        } else if (updatedFiles.length > 5) {
            setErrorMessage(
                `Too many images uploaded. Please remove ${updatedFiles.length - 5} image`,
            );
        } else {
            setErrorMessage(null);
        }
    };

    const handleChange = async (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value } = e.target;

        if (name === 'itemType') {
            setFormData(prevState => ({
                ...prevState,
                itemType: value,
            }));
        } else if (name === 'donorEmail') {
            const selectedDonor = donorEmailOptions.find(
                option => option.value === value,
            );
            setFormData(prevState => ({
                ...prevState,
                donorId: selectedDonor?.id || null,
            }));
        } else if (name === 'program') {
            const selectedProgram = programOptions.find(
                option => option.value === value,
            );
            setFormData(prevState => ({
                ...prevState,
                programId: selectedProgram?.id || null,
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: value,
            }));
        }
        setErrors(prevState => ({ ...prevState, [name]: '' }));
        setErrorMessage(null);
        setSuccessMessage(null);
    };

    const scrollToError = () => {
        setTimeout(() => {
            const errorElement = document.getElementById('error-message');
            if (errorElement) {
                errorElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
            }
        }, 100);
    };

    const validateField = (name: string, value: any) => {
        const requiredFields = [
            'itemType',
            'currentStatus',
            'donorEmail',
            'dateDonated',
        ];

        if (requiredFields.includes(name) && (!value || value.length === 0)) {
            return `${name.replace(/([A-Z])/g, ' $1')} is required`;
        }
        return '';
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
        setIsLoading(true);
        event.preventDefault();
        if (validateForm()) {
            try {
                const formDataToSubmit = new FormData();
                formDataToSubmit.append('itemType', formData.itemType);
                formDataToSubmit.append(
                    'currentStatus',
                    formData.currentStatus,
                );
                formDataToSubmit.append(
                    'donorId',
                    formData.donorId ? formData.donorId.toString() : '',
                );
                formDataToSubmit.append(
                    'programId',
                    formData.programId ? formData.programId.toString() : '',
                );
                formDataToSubmit.append('dateDonated', formData.dateDonated);

                // Append image files directly as part of the FormData
                formData.imageFiles.forEach(file => {
                    formDataToSubmit.append('imageFiles', file);
                });

                const response = await axios.post(
                    `${process.env.REACT_APP_BACKEND_API_BASE_URL}donatedItem`,
                    formDataToSubmit,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            Authorization: localStorage.getItem('token'),
                        },
                    },
                );

                if (response.status === 201) {
                    setSuccessMessage('Item added successfully!');
                    handleRefresh();
                    navigate('/donations');
                }
            } catch (error: any) {
                setErrorMessage(
                    error.response?.data?.error || 'Error adding item',
                );
            } finally {
                setIsLoading(false);
            }
        } else {
            setErrorMessage('Form has validation errors');
        }
    };

    const handleRefresh = () => {
        setIsLoading(true);
        setFormData({
            itemType: '',
            currentStatus: 'Received',
            donorId: null,
            programId: null,
            imageFiles: [],
            dateDonated: '',
        });
        setPreviews([]);
        setErrors({});
        setErrorMessage(null);
        setSuccessMessage(null);
        setIsLoading(false);
    };

    const handleBack = () => {
        setIsLoading(true);
        navigate('/donations');
        setIsLoading(false);
    };

    const renderFormField = (
        label: string,
        name: keyof FormData,
        type = 'text',
        required = true,
        options?: Option[],
    ) => (
        <div className="form-field">
            <label htmlFor={name} className="block text-sm font-semibold mb-1">
                {label}
                {required && <span className="text-red-500">&nbsp;*</span>}
            </label>
            {name === 'imageFiles' ? (
                <div>
                    <input
                        type="file"
                        id={name}
                        name={name}
                        onChange={handleImageChange}
                        multiple
                        accept="image/*"
                        className={`w-full px-3 py-2 rounded border ${
                            errors[name] ? 'border-red-500' : 'border-gray-300'
                        }`}
                        title="Upload 1-5 images in JPG or PNG format"
                    />
                    <div className="image-preview-grid mt-4">
                        {previews.map((preview, index) => (
                            <div key={index} className="preview-item relative">
                                <img
                                    src={preview}
                                    alt={`Preview ${index + 1}`}
                                    className="preview-image"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="remove-image-button"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            ) : options ? (
                <select
                    id={name}
                    name={name}
                    value={formData[name] as string}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 rounded border ${
                        errors[name] ? 'border-red-500' : 'border-gray-300'
                    }`}
                >
                    <option value="">Select {label}</option>
                    {options.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    type={type}
                    id={name}
                    name={name}
                    value={formData[name] as string}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 rounded border ${
                        errors[name] ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={name === 'currentStatus'}
                />
            )}
            {errors[name] && (
                <p className="text-red-500 text-sm mt-1">{errors[name]}</p>
            )}
        </div>
    );

    return (
        <div className="donor-form outer-container mx-auto p-10">
            <h1 className="text-2xl font-bold heading-centered">
                New Donated Item
            </h1>
            {errorMessage && (
                <p id="error-message" className="error-message">
                    {errorMessage}
                </p>
            )}
            {successMessage && (
                <p className="success-message">{successMessage}</p>
            )}
            <form onSubmit={handleSubmit} className="form-grid">
                {renderFormField(
                    'Item Type',
                    'itemType',
                    'text',
                    true,
                    itemTypeOptions,
                )}
                {renderFormField('Current Status', 'currentStatus')}
                {renderFormField(
                    'Donor Email',
                    'donorId',
                    'text',
                    true,
                    donorEmailOptions,
                )}
                {renderFormField(
                    'Program',
                    'programId',
                    'text',
                    false,
                    programOptions,
                )}
                {renderFormField('Date Donated', 'dateDonated', 'date')}
                {renderFormField('Images (Max 5)', 'imageFiles', 'file', false)}

                <div className="form-field full-width button-container">
                    <button
                        type="submit"
                        className="submit-button"
                        disabled={isLoading}
                    >
                        Submit
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

export default NewItemForm;
