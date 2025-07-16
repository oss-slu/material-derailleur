import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/DonorForm.css';
import LoadingSpinner from './LoadingSpinner';

interface Donor {
    id: number;
    firstName: string;
    lastName: string;
    contact: string;
    email: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    zipcode: string;
    emailOptIn: boolean;
}

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

const DonorEdit: React.FC = () => {
    const navigate = useNavigate();
    let donor = null;
    const donorData = localStorage.getItem('donor');
    if (donorData) {
        donor = JSON.parse(donorData);
    }
    if (!donor) {
        console.error('Donor does not exist!');
        navigate('/donorlist');
    }
    const donorId = donor.id;
    const oldEmail = donor.email;
    const [formData, setFormData] = useState<FormData>({
        firstName: donor.firstName,
        lastName: donor.lastName,
        contact: donor.contact,
        email: donor.email,
        addressLine1: donor.addressLine1,
        addressLine2: donor.addressLine2,
        state: donor.state,
        city: donor.city,
        zipcode: donor.zipcode,
        emailOptIn: donor.emailOptIn,
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Handle input change for all fields
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value,
        }));
        setErrors(prevState => ({ ...prevState, [name]: '' })); // Reset errors on change
        setErrorMessage(null);
        setSuccessMessage(null);
    };

    // Generalized validation function to reduce code repetition
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
            return `${name.replace(/([A-Z])/g, ' $1')} is required`; // Add spaces to camelCase names
        }
        if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            return 'Invalid email format';
        } else if (name === 'contact' && value && !/^[0-9]{10}$/.test(value)) {
            return 'Contact must be a 10-digit number';
        } else if (name === 'zipcode' && !/^\d{5}$/.test(value)) {
            return 'Invalid zip code format';
        }
        return '';
    };

    // Validation for entire form
    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        Object.keys(formData).forEach(field => {
            const error = validateField(field, (formData as any)[field]);
            if (error) newErrors[field] = error;
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        if (validateForm()) {
            if (!donorId) {
                setErrorMessage('Donor ID is missing!');
                navigate('/donorlist');
            }
            try {
                const toSend = { ...formData, id: donorId, old: oldEmail };
                console.log(toSend);
                const response = await axios.post(
                    `${process.env.REACT_APP_BACKEND_API_BASE_URL}donor/edit`,
                    toSend,
                );
                if (response.status === 200) {
                    navigate('/donorlist');
                } else {
                    setErrorMessage('Error Updating Donor');
                }
            } catch (error: unknown) {
                const message =
                    (error as any).response?.data?.message ||
                    'Error Updating donor';
                setErrorMessage(message);
            } finally {
                setIsLoading(false);
            }
        } else {
            setErrorMessage('Form has validation errors');
        }
    };

    const handleBack = () => {
        setIsLoading(true);
        navigate('/donorlist');
        setIsLoading(false);
    };

    // Reusable function to render form fields (text and checkbox)
    const renderFormField = (
        label: string,
        name: keyof FormData,
        type = 'text',
        required = true,
    ) => (
        <div className="form-field">
            <label htmlFor={name} className="block text-sm font-semibold mb-1">
                {label}
                {required && <span className="text-red-500">&nbsp;*</span>}
            </label>
            <input
                type={type}
                id={name}
                name={name}
                value={formData[name] as string}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded border ${errors[name] ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors[name] && (
                <p className="text-red-500 text-sm mt-1">{errors[name]}</p>
            )}
        </div>
    );

    return (
        <div className="donor-form outer-container mx-auto p-10">
            <h1 className="text-2xl font-bold heading-centered">
                Edit Donor Details
            </h1>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {successMessage && (
                <p className="success-message">{successMessage}</p>
            )}
            <form onSubmit={handleSubmit} className="form-grid">
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
                        Update Donor
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

export default DonorEdit;
