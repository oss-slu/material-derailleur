import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import '../css/AddProgramPage.css';
import axios from 'axios';
import { MAX_TEXT } from '../constants/validation';
import { isTooLong, isBlank, isFormValid } from '../constants/programValChecks';

interface ProgramData {
    name: string;
    description: string;
    startDate: string;
    aimAndCause: string;
}

const AddProgramPage: React.FC = () => {
    const [formData, setFormData] = useState<ProgramData>({
        name: '',
        description: '',
        startDate: '',
        aimAndCause: '',
    });

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [submitAttempted, setSubmitAttempted] = useState(false);
    const navigate = useNavigate();

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleBlur = (
        e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value.trim() }));
    };

    const handleSave = async () => {
        setSubmitAttempted(true);
        if (!isFormValid(formData)) return;

        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_API_BASE_URL}program`,
                formData,
                {
                    headers: {
                        Authorization: localStorage.getItem('token') || '',
                    },
                },
            );

            if (response.status === 201) {
                setSuccess('Program created successfully!');
                setTimeout(() => navigate('/programs'), 1200);
            } else {
                setError('Failed to create program.');
            }
        } catch (err: unknown) {
            const message =
                (err as any)?.response?.data?.message ||
                'Error creating program';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClear = () => {
        setFormData({
            name: '',
            description: '',
            startDate: '',
            aimAndCause: '',
        });
        setError(null);
        setSuccess(null);
        setSubmitAttempted(false);
    };

    const showNameEmpty = submitAttempted && isBlank(formData.name);
    const showDateEmpty = submitAttempted && isBlank(formData.startDate);
    const showDescEmpty = submitAttempted && isBlank(formData.description);
    const showAimEmpty = submitAttempted && isBlank(formData.aimAndCause);

    return (
        <div className="container">
            <form
                className="form"
                onSubmit={e => {
                    e.preventDefault();
                    handleSave();
                }}
                noValidate
            >
                <h1 className="heading">Add Program</h1>

                {submitAttempted && !isFormValid(formData) && (
                    <p className="error-message">
                        Please fix the highlighted fields. (Spaces don’t count.)
                    </p>
                )}
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}

                <div className="form-group">
                    <label className="label">
                        Name <span className="required">*</span>
                    </label>
                    <input
                        className="input"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        aria-invalid={showNameEmpty}
                        required
                    />
                    {showNameEmpty && (
                        <p className="error-message">
                            Field cannot be empty (spaces don’t count).
                        </p>
                    )}
                </div>

                <div className="form-group">
                    <label className="label">
                        Description <span className="required">*</span>
                    </label>
                    <textarea
                        className="textarea"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        aria-invalid={
                            submitAttempted &&
                            (showDescEmpty || isTooLong(formData.description))
                        }
                        required
                    />
                    {showDescEmpty && (
                        <p className="error-message">
                            Field cannot be empty (spaces don’t count).
                        </p>
                    )}
                    {!showDescEmpty && isTooLong(formData.description) && (
                        <p className="error-message">
                            This field accepts a maximum of {MAX_TEXT}{' '}
                            characters.
                        </p>
                    )}
                </div>

                <div className="form-group">
                    <label className="label">
                        Start Date <span className="required">*</span>
                    </label>
                    <input
                        className="input"
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        aria-invalid={showDateEmpty}
                        required
                    />
                    {showDateEmpty && (
                        <p className="error-message">Field cannot be empty.</p>
                    )}
                </div>

                <div className="form-group">
                    <label className="label">
                        Aim and Cause <span className="required">*</span>
                    </label>
                    <textarea
                        className="textarea"
                        name="aimAndCause"
                        value={formData.aimAndCause}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        aria-invalid={
                            submitAttempted &&
                            (showAimEmpty || isTooLong(formData.aimAndCause))
                        }
                        required
                    />
                    {showAimEmpty && (
                        <p className="error-message">
                            Field cannot be empty (spaces don’t count).
                        </p>
                    )}
                    {!showAimEmpty && isTooLong(formData.aimAndCause) && (
                        <p className="error-message">
                            This field accepts a maximum of {MAX_TEXT}{' '}
                            characters.
                        </p>
                    )}
                </div>

                <div className="button-group">
                    <button
                        className="save-button"
                        type="submit"
                        disabled={isLoading || !isFormValid(formData)}
                    >
                        Save
                    </button>
                    <button
                        className="clear-button"
                        type="button"
                        disabled={isLoading}
                        onClick={handleClear}
                    >
                        Clear
                    </button>
                </div>

                <div className="back-to-programs">
                    <Link to="/programs">
                        <button className="back-button" disabled={isLoading}>
                            Back to Programs
                        </button>
                    </Link>
                </div>

                {isLoading && <LoadingSpinner />}
            </form>
        </div>
    );
};

export default AddProgramPage;
