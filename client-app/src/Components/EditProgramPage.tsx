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

const EditProgramPage = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  let program = null as any;
  const programData = localStorage.getItem('program');
  if (programData) {
    program = JSON.parse(programData);
  }
  if (!program) {
    navigate('/programs');
  }
  const programId = program?.id;
  const [formData, setFormData] = useState<ProgramData>({
    name: program?.name ?? '',
    description: program?.description ?? '',
    startDate: program?.startDate ? program.startDate.toString().split('T')[0] : '',
    aimAndCause: program?.aimAndCause ?? '',
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
    if (!isFormValid(formData)) return;
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API_BASE_URL}program/edit`,
        { ...formData, id: programId },
      );

      if (response.status === 200) {
        setSuccess('Program edited successfully! Returning...');
        setError(null);
        setTimeout(() => {
          navigate('/programs');
        }, 1200);
      } else {
        setError('Failed to edit program.');
        setSuccess(null);
      }
    } catch (error: unknown) {
      const message =
        (error as any).response?.data?.message ||
        'Error editing program';
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
