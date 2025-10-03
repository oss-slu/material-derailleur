import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import '../css/AddProgramPage.css';
import axios from 'axios';

interface ProgramData {
  name: string;
  description: string;
  startDate: string;
  aimAndCause: string;
}

const MAX_TEXT = 500;
const isTooLong = (s: string) => s.trim().length > MAX_TEXT;
const isEmpty = (s: string) => s.trim().length === 0;
const isFormValid = (d: ProgramData) =>
  !isEmpty(d.name) &&
  !isEmpty(d.startDate) &&
  !isEmpty(d.description) &&
  !isEmpty(d.aimAndCause) &&
  !isTooLong(d.description) &&
  !isTooLong(d.aimAndCause);

const AddProgramPage = () => {
  const [formData, setFormData] = useState<ProgramData>({
    name: '',
    description: '',
    startDate: '',
    aimAndCause: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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
    if (!isFormValid(formData)) return;
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API_BASE_URL}program`,
        formData,
        {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        },
      );

      if (response.status === 201) {
        setSuccess('Program created successfully!');
        setError(null);
        setTimeout(() => {
          navigate('/programs');
        }, 1200);
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

  const handleClear = () => {
    setFormData({
      name: '',
      description: '',
      startDate: '',
      aimAndCause: '',
    });
    setError(null);
    setSuccess(null);
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
        <h1 className="heading">Add Program</h1>
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
          {isTooLong(formData.description) && (
            <p className="error-message">This field accepts a maximum of 500 characters.</p>
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
          {isTooLong(formData.aimAndCause) && (
            <p className="error-message">This field accepts a maximum of 500 characters.</p>
          )}
        </div>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
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
