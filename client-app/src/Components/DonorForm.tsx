import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import '../css/DonorForm.css';

interface FormData {
    firstName: string;
    lastName: string;
    contact: string;
    email: string;
    addressLine1: string;
    addressLine2: string;
    state: string;
    city: string;
    zipcode: string;
    emailOptIn: boolean;
}

interface FormErrors {
    [key: string]: string;
}

// Letters (incl. accents) + spaces ONLY for city/state
const ALPHA_SPACE_PATTERN = /^[A-Za-zÀ-ÿ ]+$/;
const ALPHA_SPACE_PATTERN_STR = '^[A-Za-zÀ-ÿ ]+$'; // for HTML pattern

const DonorForm: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<FormData>({
        firstName: '',
        lastName: '',
        contact: '',
        email: '',
        addressLine1: '',
        addressLine2: '',
        state: '',
        city: '',
        zipcode: '',
        emailOptIn: false,
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
        setErrors(prev => ({ ...prev, [name]: '' }));
        setErrorMessage(null);
        setSuccessMessage(null);
    };

    const validateField = (name: string, value: string) => {
        const requiredFields = [
            'firstName',
            'lastName',
            'contact',
            'email',
            'addressLine1',
            'state',
            'city',
            'zipcode',
        ];

        if (requiredFields.includes(name) && !value.trim()) {
            return `${name.replace(/([A-Z])/g, ' $1')} is required`;
        }

        if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            return 'Invalid email format';
        }

        if (name === 'contact' && value && !/^[0-9]{10}$/.test(value)) {
            return 'Contact must be a 10-digit number';
        }

        if (name === 'zipcode' && !/^\d{5}$/.test(value)) {
            return 'Invalid zip code format';
        }

        // City/State: letters + spaces only
        if (
            (name === 'city' || name === 'state') &&
            value &&
            !ALPHA_SPACE_PATTERN.test(value)
        ) {
            return 'Only letters and spaces are allowed';
        }

        return '';
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        (
            Object.entries(formData) as [keyof FormData, string | boolean][]
        ).forEach(([field, value]) => {
            if (typeof value === 'boolean') return;
            const error = validateField(field as string, value as string);
            if (error) newErrors[field as string] = error;
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        if (validateForm()) {
            try {
                const response = await axios.post(
                    `${process.env.REACT_APP_BACKEND_API_BASE_URL}donor`,
                    formData,
                    {
                        headers: {
                            Authorization: localStorage.getItem('token') || '',
                        },
                    },
                );

                if (response.status === 201) {
                    const login_response = await axios.post(
                        `${process.env.REACT_APP_BACKEND_API_BASE_URL}donor/register`,
                        { name: formData.firstName, email: formData.email },
                    );

                    if (login_response.status === 201) {
                        setSuccessMessage('Donor added successfully!');
                        setFormData({
                            firstName: '',
                            lastName: '',
                            contact: '',
                            email: '',
                            addressLine1: '',
                            addressLine2: '',
                            state: '',
                            city: '',
                            zipcode: '',
                            emailOptIn: false,
                        });
                        navigate('/donorlist');
                    } else {
                        setErrorMessage('Donor could not be registered');
                    }
                } else {
                    setErrorMessage('Donor not added');
                }
            } catch (error: unknown) {
                const message =
                    (error as any).response?.data?.message ||
                    'Error adding donor';
                setErrorMessage(message);
            } finally {
                setIsLoading(false);
            }
        } else {
            setErrorMessage('Form has validation errors');
            setIsLoading(false);
        }
    };

    const handleRefresh = () => {
        setIsLoading(true);
        setFormData({
            firstName: '',
            lastName: '',
            contact: '',
            email: '',
            addressLine1: '',
            addressLine2: '',
            state: '',
            city: '',
            zipcode: '',
            emailOptIn: false,
        });
        setErrors({});
        setErrorMessage(null);
        setSuccessMessage(null);
        setIsLoading(false);
    };

    const handleBack = () => {
        setIsLoading(true);
        navigate('/donorlist');
        setIsLoading(false);
    };

    const renderFormField = (
        label: string,
        name: keyof FormData,
        type: 'text' | 'email' = 'text',
        required = true,
    ) => {
        const isAlphaSpace = name === 'city' || name === 'state';
        const isNumeric = name === 'contact' || name === 'zipcode';
        const zipPattern = '^\\d{5}$';
        const hasError = Boolean(errors[name]);

        return (
            <div className="form-field">
                <label
                    htmlFor={name}
                    className="block text-sm font-semibold mb-1"
                >
                    {label}
                    {required && <span className="text-red-500">&nbsp;*</span>}
                </label>

                <input
                    type={type}
                    id={name}
                    name={name}
                    value={formData[name] as string}
                    onChange={handleChange}
                    inputMode={isNumeric ? 'numeric' : 'text'}
                    pattern={
                        isAlphaSpace
                            ? ALPHA_SPACE_PATTERN_STR
                            : name === 'zipcode'
                              ? zipPattern
                              : undefined
                    }
                    title={
                        isAlphaSpace
                            ? 'Only letters and spaces are allowed'
                            : name === 'zipcode'
                              ? 'Use 5 digits (e.g., 63103)'
                              : undefined
                    }
                    className={`w-full px-3 py-2 rounded border ${hasError ? 'border-red-500' : 'border-gray-300'}`}
                    aria-invalid={hasError}
                    aria-describedby={hasError ? `${name}-error` : undefined}
                />

                {errors[name] && (
                    <p
                        className="text-red-700 font-bold text-sm mt-1"
                        id={`${name}-error`}
                        role="alert"
                    >
                        {errors[name]}
                    </p>
                )}
            </div>
        );
    };

    return (
        <div className="donor-form outer-container mx-auto p-10">
            <h1 className="text-2xl font-bold heading-centered">
                Add Donor Details
            </h1>


            {errorMessage && (
                <p
                    className="error-message text-red-700 font-bold"
                    role="alert"
                >
                    {errorMessage}
                </p>
            )}
            {successMessage && (
                <p className="success-message" role="status">
                    {successMessage}
                </p>
            )}

            {/* Disable native browser validation popups/tooltips */}
            <form onSubmit={handleSubmit} className="form-grid" noValidate>
                {renderFormField('First Name', 'firstName')}
                {renderFormField('Last Name', 'lastName')}
                {renderFormField('Contact', 'contact')}
                {renderFormField('Email ID', 'email', 'email')}
                {renderFormField('Address Line 1', 'addressLine1')}
                {renderFormField(
                    'Address Line 2',
                    'addressLine2',
                    'text',
                    false,
                )}
                {renderFormField('State', 'state')}
                {renderFormField('City', 'city')}
                {renderFormField('Zip Code', 'zipcode')}

                <div className="form-field">
                    <label
                        htmlFor="emailOptIn"
                        className="block text-sm font-semibold mb-1"
                    >
                        Email Opt-in
                    </label>
                    <div className="checkbox-container">
                        <input
                            type="checkbox"
                            id="emailOptIn"
                            name="emailOptIn"
                            checked={formData.emailOptIn}
                            onChange={handleChange}
                        />
                        <span className="checkbox-message">
                            {' '}
                            Stay updated with donation progress
                        </span>
                    </div>
                </div>

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

export default DonorForm;
