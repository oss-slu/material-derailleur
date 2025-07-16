import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/AddProgramPage.css';
import axios from 'axios';
import LoadingSpinner from './LoadingSpinner';

interface ProgramData {
    name: string;
    description: string;
    startDate: string;
    aimAndCause: string;
}

const EditProgramPage = () => {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    let program = null;
    const programData = localStorage.getItem('program');
    if (programData) {
        program = JSON.parse(programData);
    }
    if (!program) {
        console.error('Program does not exist!');
        navigate('/programs');
    }
    const programId = program.id;
    const [formData, setFormData] = useState<ProgramData>({
        name: program.name,
        description: program.description,
        startDate: program.startDate.toString().split('T')[0],
        aimAndCause: program.aimAndCause,
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_API_BASE_URL}program/edit`,
                { ...formData, id: programId },
            );

            if (response.status === 200) {
                setSuccess('Program edited successfully! Returning...');
                setError(null);

                setFormData({
                    name: '',
                    description: '',
                    startDate: '',
                    aimAndCause: '',
                });

                setTimeout(() => {
                    navigate('/programs');
                }, 2000);
            } else {
                setError('Failed to create program.');
                setSuccess(null);
            }
        } catch (error: unknown) {
            const message =
                (error as any).response?.data?.message ||
                'Error creating program';
            setError(message);
            setSuccess(null);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container">
            <form
                className="form"
                onSubmit={e => {
                    e.preventDefault();
                    handleSave();
                }}
            >
                <h1 className="heading">Edit Program</h1>
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
                        required
                    />
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
                        required
                    />
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
                        required
                    />
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
                        required
                    />
                </div>
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}
                <div className="button-group">
                    <button
                        className="save-button"
                        type="submit"
                        disabled={isLoading}
                    >
                        Save
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

export default EditProgramPage;
