import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import '../css/DonorForm.css';

interface FormData {
  itemType: string;
  currentStatus: string;
  donorId: number | null;
  programId: number | null;
  dateDonated: string;
  imageFiles: File[];
  category: string;
  quantity: number;
}

interface FormErrors {
  [key: string]: string;
}

interface Option {
  value: string; // keep as string for <select>, store numeric id separately in id
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
    category: '',
    quantity: 1,
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
          { headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
 }
        );
        const emailOptions = response.data.map((donor: any) => ({
          value: String(donor.id),       // string for select
          label: donor.email,
          id: donor.id as number,        // numeric id for mapping
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
          { headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` } }
        );
        const progOptions = response.data.map((program: any) => ({
          value: String(program.id),
          label: program.name,
          id: program.id as number,
        }));
        setProgramOptions(progOptions);
      } catch (error) {
        console.error('Error fetching programs:', error);
      }
    };

    fetchDonorEmails();
    fetchPrograms();
  }, []);

  const convertToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);

    fileArray.forEach((file) => {
      if (file.size > maxImageSize) {
        setErrorMessage(`File size too large: ${file.name} (Max: 5MB)`);
        scrollToError();
      }
    });

    const nextCount = formData.imageFiles.length + fileArray.length;
    if (nextCount > 6) {
      setErrorMessage(`Too many images uploaded. Please remove ${nextCount - 5} images`);
      scrollToError();
    } else if (nextCount > 5) {
      setErrorMessage(`Too many images uploaded. Please remove ${nextCount - 5} image`);
      scrollToError();
    }

    setFormData((prev) => ({
      ...prev,
      imageFiles: [...prev.imageFiles, ...fileArray],
    }));

    const filePreviews = await Promise.all(
      fileArray.map((file) => convertToBase64(file))
    );
    setPreviews((prev) => [...prev, ...filePreviews]);
  };

  const removeImage = (index: number) => {
    const updatedFiles = formData.imageFiles.filter((_, i) => i !== index);
    const updatedPreviews = previews.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, imageFiles: updatedFiles }));
    setPreviews(updatedPreviews);

    const oversizedFile = updatedFiles.find((file) => file.size > maxImageSize);
    if (oversizedFile) {
      setErrorMessage(`File size too large: ${oversizedFile.name} (Max: 5MB)`);
      scrollToError();
    } else if (updatedFiles.length > 6) {
      setErrorMessage(`Too many images uploaded. Please remove ${updatedFiles.length - 5} images`);
    } else if (updatedFiles.length > 5) {
      setErrorMessage(`Too many images uploaded. Please remove ${updatedFiles.length - 5} image`);
    } else {
      setErrorMessage(null);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'itemType') {
      setFormData((p) => ({ ...p, itemType: value }));
    } else if (name === 'donorId') {
      const selected = donorEmailOptions.find((opt) => opt.value === value);
      setFormData((p) => ({ ...p, donorId: selected?.id ?? null }));
    } else if (name === 'programId') {
      const selected = programOptions.find((opt) => opt.value === value);
      setFormData((p) => ({ ...p, programId: selected?.id ?? null }));
    } else if (name === 'quantity') {
      setFormData((p) => ({ ...p, quantity: Number(value) || 0 }));
    } else {
      setFormData((p) => ({ ...p, [name]: value }));
    }

    setErrors((prev) => ({ ...prev, [name]: '' }));
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const scrollToError = () => {
    setTimeout(() => {
      const el = document.getElementById('error-message');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const validateField = (name: string, value: any) => {
    const required = ['itemType', 'currentStatus', 'dateDonated', 'category', 'quantity', 'donorId'];
    if (required.includes(name)) {
      if (name === 'quantity') {
        if (!Number.isFinite(value) || value <= 0) return 'Quantity must be a positive number';
      } else if (
        value === null ||
        value === undefined ||
        (typeof value === 'string' && value.trim().length === 0)
      ) {
        return `${name.replace(/([A-Z])/g, ' $1')} is required`;
      }
    }
    return '';
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    (Object.keys(formData) as (keyof FormData)[]).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    event.preventDefault();

    if (!validateForm()) {
      setErrorMessage('Form has validation errors');
      setIsLoading(false);
      return;
    }

    try {
      const fd = new FormData();
      fd.append('itemType', formData.itemType);
      fd.append('currentStatus', formData.currentStatus);
      fd.append('donorId', formData.donorId ? String(formData.donorId) : '');
      fd.append('programId', formData.programId ? String(formData.programId) : '');
      fd.append('dateDonated', formData.dateDonated);
      fd.append('category', formData.category);
      fd.append('quantity', String(formData.quantity));

      // run analysis by default; change to 'true' to opt-out
      fd.append('optOutAnalysis', 'false');

      formData.imageFiles.forEach((file) => fd.append('imageFiles', file));

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API_BASE_URL}donatedItem`,
        fd,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: localStorage.getItem('token') || '',
          },
        }
      );

      if (response.status === 201) {
        setSuccessMessage('Item added successfully!');
        handleRefresh();
        navigate('/donations');
      }
    } catch (error: any) {
      setErrorMessage(error.response?.data?.error || 'Error adding item');
    } finally {
      setIsLoading(false);
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
      category: '',
      quantity: 1,
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
            className={`w-full px-3 py-2 rounded border ${errors[name] ? 'border-red-500' : 'border-gray-300'}`}
            title="Upload 1-5 images in JPG or PNG format"
          />
          <div className="image-preview-grid mt-4">
            {previews.map((preview, index) => (
              <div key={index} className="preview-item relative">
                <img src={preview} alt={`Preview ${index + 1}`} className="preview-image" />
                <button type="button" onClick={() => removeImage(index)} className="remove-image-button">
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
          value={String(formData[name] ?? '')}
          onChange={handleChange}
          className={`w-full px-3 py-2 rounded border ${errors[name] ? 'border-red-500' : 'border-gray-300'}`}
        >
          <option value="">Select {label}</option>
          {options.map((option) => (
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
          value={String(formData[name] ?? '')}
          onChange={handleChange}
          className={`w-full px-3 py-2 rounded border ${errors[name] ? 'border-red-500' : 'border-gray-300'}`}
          disabled={name === 'currentStatus'}
          min={name === 'quantity' ? 1 : undefined}
        />
      )}

      {errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="donor-form outer-container mx-auto p-10">
      <h1 className="text-2xl font-bold heading-centered">New Donated Item</h1>

      {errorMessage && (
        <p id="error-message" className="error-message">
          {errorMessage}
        </p>
      )}
      {successMessage && <p className="success-message">{successMessage}</p>}

      <form onSubmit={handleSubmit} className="form-grid">
        {renderFormField('Item Type', 'itemType', 'text', true, itemTypeOptions)}
        {renderFormField('Current Status', 'currentStatus')}
        {renderFormField('Donor Email', 'donorId', 'text', true, donorEmailOptions)}
        {renderFormField('Program', 'programId', 'text', false, programOptions)}
        {renderFormField('Category', 'category')}
        {renderFormField('Quantity', 'quantity', 'number')}
        {renderFormField('Date Donated', 'dateDonated', 'date')}
        {renderFormField('Images (Max 5)', 'imageFiles', 'file', false)}

        <div className="form-field full-width button-container">
          <button type="submit" className="submit-button" disabled={isLoading}>
            Submit
          </button>
          <button type="button" onClick={handleRefresh} className="refresh-button" disabled={isLoading}>
            Refresh
          </button>
          <button type="button" onClick={handleBack} className="back-button" disabled={isLoading}>
            Back
          </button>
        </div>
        {isLoading && <LoadingSpinner />}
      </form>
    </div>
  );
};

export default NewItemForm;
