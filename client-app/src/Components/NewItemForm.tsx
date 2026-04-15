import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import '../css/DonorForm.css';

type AttributeValueType = 'string' | 'number' | 'boolean';

interface SelectedAttribute {
    descriptor: string;
    valueType: AttributeValueType;
    value: string;
    booleanValue: boolean | null;
}

interface FormData {
    itemType: string;
    currentStatus: string;
    donorId: number | null;
    programId: number | null;
    dateDonated: string;
    imageFiles: File[];
    category: string;
    quantity: number;
    selectedItemAttributes: SelectedAttribute[];
}

interface FormErrors {
    [key: string]: string;
}

interface Option {
    value: string; // keep as string for <select>, store numeric id separately in id
    label: string;
    id?: number;
    valueType?: AttributeValueType;
}

interface AttributeDefinition {
    descriptor: string;
    valueType: AttributeValueType;
}

const DEFAULT_ATTRIBUTE_DEFINITIONS_BICYCLE: AttributeDefinition[] = [
    { descriptor: 'brand', valueType: 'string' },
    { descriptor: 'model', valueType: 'string' },
    { descriptor: 'standover height (in.)', valueType: 'number' },
    { descriptor: 'type', valueType: 'string' },
    { descriptor: 'color', valueType: 'string' },
    { descriptor: 'wheel size (in.)', valueType: 'number' },
    { descriptor: 'condition', valueType: 'string' },
    { descriptor: 'needs repair', valueType: 'boolean' },
    { descriptor: 'note', valueType: 'string' },
];

const DEFAULT_ATTRIBUTE_DEFINITIONS_COMPUTER: AttributeDefinition[] = [
    { descriptor: 'brand', valueType: 'string' },
    { descriptor: 'model', valueType: 'string' },
    { descriptor: 'condition', valueType: 'string' },
    { descriptor: 'type', valueType: 'string' },
    { descriptor: 'needs repair', valueType: 'boolean' },
    { descriptor: 'cpu', valueType: 'string' },
    { descriptor: 'ram (GB)', valueType: 'number' },
    { descriptor: 'storage (GB)', valueType: 'number' },
    { descriptor: 'note', valueType: 'string' },
];

const getDefaultDescriptorsForItemType = (itemType: string) => {
    if (itemType === 'bicycle') {
        return DEFAULT_ATTRIBUTE_DEFINITIONS_BICYCLE;
    }

    if (itemType === 'computer') {
        return DEFAULT_ATTRIBUTE_DEFINITIONS_COMPUTER;
    }

    return [
        ...DEFAULT_ATTRIBUTE_DEFINITIONS_BICYCLE,
        ...DEFAULT_ATTRIBUTE_DEFINITIONS_COMPUTER,
    ];
};

const normalizeDescriptor = (value?: string | null) =>
    value?.trim().toLowerCase() || '';

const formatAttributeTypeLabel = (valueType: AttributeValueType) => {
    if (valueType === 'number') return 'Number';
    if (valueType === 'boolean') return 'Yes / No';
    return 'Text';
};

const NewItemForm: React.FC = () => {
    const maxImageSize = 5 * 1024 * 1024; // 5MB
    const navigate = useNavigate();

    const [formData, setFormData] = useState<FormData>({
        itemType: '',
        currentStatus: 'Received',
        donorId: null,
        programId: null,
        imageFiles: [],
        dateDonated: new Date().toISOString().split('T')[0] || '',
        category: '',
        quantity: 1,
        selectedItemAttributes: [],
    });

    const itemTypeOptions: Option[] = [
        { value: 'bicycle', label: 'Bicycle' },
        { value: 'computer', label: 'Computer' },
    ];

    const [donorEmailOptions, setDonorEmailOptions] = useState<Option[]>([]);
    const [programOptions, setProgramOptions] = useState<Option[]>([]);
    const [attributeOptions, setAttributeOptions] = useState<Option[]>([]);
    const [selectedDescriptor, setSelectedDescriptor] = useState('');
    const [customDescriptor, setCustomDescriptor] = useState('');
    const [customAttributeType, setCustomAttributeType] =
        useState<AttributeValueType>('string');
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
                            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
                        },
                    },
                );
                const emailOptions = response.data.map((donor: any) => ({
                    value: String(donor.id), // string for select
                    label: donor.email,
                    id: donor.id as number, // numeric id for mapping
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
                            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
                        },
                    },
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

        const fetchAttributes = async () => {
            const defaultDefinitions = getDefaultDescriptorsForItemType(
                formData.itemType,
            );

            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_BACKEND_API_BASE_URL}donatedItem/attributes`,
                    {
                        params: formData.itemType
                            ? { itemType: formData.itemType }
                            : undefined,
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
                        },
                    },
                );
                const definitions = [
                    ...defaultDefinitions,
                    ...response.data.map((attr: any) => ({
                        descriptor: String(attr.descriptor ?? '').trim(),
                        valueType: attr.valueType as AttributeValueType,
                    })),
                ];
                const uniqueDescriptors = Array.from(
                    definitions.reduce((acc, definition) => {
                        const descriptor = definition.descriptor.trim();
                        if (!descriptor) {
                            return acc;
                        }

                        const normalized = normalizeDescriptor(descriptor);
                        if (!acc.has(normalized)) {
                            acc.set(normalized, {
                                descriptor,
                                valueType: definition.valueType ?? 'string',
                            });
                        }

                        return acc;
                    }, new Map<string, AttributeDefinition>()),
                    ([, definition]) => definition,
                ).sort((a, b) =>
                    a.descriptor.localeCompare(b.descriptor),
                );
                setAttributeOptions(
                    uniqueDescriptors.map(definition => ({
                        value: definition.descriptor,
                        label: definition.descriptor,
                        valueType: definition.valueType,
                    })),
                );
            } catch (error) {
                console.error('Error fetching attributes:', error);
                setAttributeOptions(
                    defaultDefinitions.map(definition => ({
                        value: definition.descriptor,
                        label: definition.descriptor,
                        valueType: definition.valueType,
                    })),
                );
            }
        };

        fetchDonorEmails();
        fetchPrograms();
        fetchAttributes();
    }, [formData.itemType]);

    const convertToBase64 = (file: File): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });

    const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const fileArray = Array.from(files);

        fileArray.forEach(file => {
            if (file.size > maxImageSize) {
                setErrorMessage(`File size too large: ${file.name} (Max: 5MB)`);
                scrollToError();
            }
        });

        const nextCount = formData.imageFiles.length + fileArray.length;
        if (nextCount > 6) {
            setErrorMessage(
                `Too many images uploaded. Please remove ${nextCount - 5} images`,
            );
            scrollToError();
        } else if (nextCount > 5) {
            setErrorMessage(
                `Too many images uploaded. Please remove ${nextCount - 5} image`,
            );
            scrollToError();
        }

        setFormData(prev => ({
            ...prev,
            imageFiles: [...prev.imageFiles, ...fileArray],
        }));

        const filePreviews = await Promise.all(
            fileArray.map(file => convertToBase64(file)),
        );
        setPreviews(prev => [...prev, ...filePreviews]);
    };

    const removeImage = (index: number) => {
        const updatedFiles = formData.imageFiles.filter((_, i) => i !== index);
        const updatedPreviews = previews.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, imageFiles: updatedFiles }));
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

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value } = e.target;

        if (name === 'itemType') {
            setFormData(p => ({ ...p, itemType: value }));
        } else if (name === 'donorId') {
            const selected = donorEmailOptions.find(opt => opt.value === value);
            setFormData(p => ({ ...p, donorId: selected?.id ?? null }));
        } else if (name === 'programId') {
            const selected = programOptions.find(opt => opt.value === value);
            setFormData(p => ({ ...p, programId: selected?.id ?? null }));
        } else if (name === 'quantity') {
            setFormData(p => ({ ...p, quantity: Number(value) || 0 }));
        } else {
            setFormData(p => ({ ...p, [name]: value }));
        }

        setErrors(prev => ({ ...prev, [name]: '' }));
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
        const required = [
            'itemType',
            'currentStatus',
            'dateDonated',
            'category',
            'quantity',
            'donorId',
        ];
        if (required.includes(name)) {
            if (name === 'quantity') {
                if (!Number.isFinite(value) || value <= 0)
                    return 'Quantity must be a positive number';
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
        (Object.keys(formData) as (keyof FormData)[]).forEach(field => {
            const error = validateField(field, formData[field]);
            if (error) newErrors[field] = error;
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const addAttribute = (descriptorInput?: string) => {
        const descriptor = (descriptorInput ?? selectedDescriptor).trim();
        if (!descriptor) {
            return;
        }

        const alreadySelected = formData.selectedItemAttributes.some(
            attr => normalizeDescriptor(attr.descriptor) === normalizeDescriptor(descriptor),
        );
        if (alreadySelected) {
            setSelectedDescriptor('');
            setCustomDescriptor('');
            return;
        }

        const existingOption = attributeOptions.find(
            option => normalizeDescriptor(option.value) === normalizeDescriptor(descriptor),
        );
        const valueType = existingOption?.valueType ?? customAttributeType;

        setFormData(prev => ({
            ...prev,
            selectedItemAttributes: [
                ...prev.selectedItemAttributes,
                {
                    descriptor,
                    valueType,
                    value: '',
                    booleanValue: null,
                },
            ],
        }));

        if (
            !attributeOptions.some(
                option =>
                    normalizeDescriptor(option.value) === normalizeDescriptor(descriptor),
            )
        ) {
            setAttributeOptions(prev =>
                [
                    ...prev,
                    {
                        value: descriptor,
                        label: descriptor,
                        valueType,
                    },
                ].sort(
                    (a, b) => a.label.localeCompare(b.label),
                ),
            );
        }

        setSelectedDescriptor('');
        setCustomDescriptor('');
        setCustomAttributeType('string');
    };

    const removeAttribute = (descriptor: string) => {
        setFormData(prev => ({
            ...prev,
            selectedItemAttributes: prev.selectedItemAttributes.filter(
                attr => attr.descriptor !== descriptor,
            ),
        }));
    };

    const updateAttribute = (
        descriptor: string,
        updates: Partial<SelectedAttribute>,
    ) => {
        setFormData(prev => ({
            ...prev,
            selectedItemAttributes: prev.selectedItemAttributes.map(attr =>
                attr.descriptor === descriptor ? { ...attr, ...updates } : attr,
            ),
        }));
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
            fd.append(
                'donorId',
                formData.donorId ? String(formData.donorId) : '',
            );
            fd.append(
                'programId',
                formData.programId ? String(formData.programId) : '',
            );
            fd.append('dateDonated', formData.dateDonated);
            fd.append('category', formData.category);
            fd.append('quantity', String(formData.quantity));
            fd.append(
                'itemAttributes',
                JSON.stringify(
                    formData.selectedItemAttributes
                        .map(attribute => {
                            const trimmedValue = attribute.value.trim();

                            if (attribute.valueType === 'boolean') {
                                if (attribute.booleanValue === null) {
                                    return null;
                                }

                                return {
                                    descriptor: attribute.descriptor,
                                    stringValue: null,
                                    numberValue: null,
                                    booleanValue: attribute.booleanValue,
                                };
                            }

                            if (!trimmedValue) {
                                return null;
                            }

                            return {
                                descriptor: attribute.descriptor,
                                stringValue:
                                    attribute.valueType === 'string'
                                        ? trimmedValue
                                        : null,
                                numberValue:
                                    attribute.valueType === 'number'
                                        ? Number(trimmedValue)
                                        : null,
                                booleanValue: null,
                            };
                        })
                        .filter(Boolean),
                ),
            );

            // run analysis by default; change to 'true' to opt-out
            fd.append('optOutAnalysis', 'false');

            formData.imageFiles.forEach(file => fd.append('imageFiles', file));

            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_API_BASE_URL}donatedItem`,
                fd,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: localStorage.getItem('token') || '',
                    },
                },
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
            dateDonated: new Date().toISOString().split('T')[0] || '',
            category: '',
            quantity: 1,
            selectedItemAttributes: [],
        });
        setSelectedDescriptor('');
        setCustomDescriptor('');
        setCustomAttributeType('string');
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
            ) : name === 'selectedItemAttributes' ? (
                <div className="attribute-editor">
                    <div
                        style={{
                            display: 'flex',
                            gap: '0.75rem',
                            alignItems: 'end',
                            flexWrap: 'wrap',
                        }}
                    >
                        <div style={{ flex: '1 1 220px' }}>
                            <label
                                htmlFor="selected-attribute-descriptor"
                                className="block text-sm font-semibold mb-1"
                            >
                                Pick descriptor
                            </label>
                            <select
                                id="selected-attribute-descriptor"
                                value={selectedDescriptor}
                                onChange={e =>
                                    setSelectedDescriptor(e.target.value)
                                }
                                className="w-full px-3 py-2 rounded border border-gray-300"
                            >
                                <option value="">Select descriptor</option>
                                {attributeOptions.map(option => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            type="button"
                            onClick={() => addAttribute()}
                            className="submit-button"
                            disabled={!selectedDescriptor}
                        >
                            Add
                        </button>
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            gap: '0.75rem',
                            alignItems: 'end',
                            flexWrap: 'wrap',
                            marginTop: '1rem',
                        }}
                    >
                        <div style={{ flex: '1 1 220px' }}>
                            <label
                                htmlFor="custom-attribute-descriptor"
                                className="block text-sm font-semibold mb-1"
                            >
                                Or create descriptor
                            </label>
                            <input
                                id="custom-attribute-descriptor"
                                type="text"
                                value={customDescriptor}
                                onChange={e =>
                                    setCustomDescriptor(e.target.value)
                                }
                                placeholder="e.g. serial number"
                                className="w-full px-3 py-2 rounded border border-gray-300"
                            />
                        </div>

                        <div style={{ flex: '0 0 160px' }}>
                            <label className="block text-sm font-semibold mb-1">
                                Type
                            </label>
                            <select
                                value={customAttributeType}
                                onChange={e =>
                                    setCustomAttributeType(
                                        e.target.value as AttributeValueType,
                                    )
                                }
                                className="w-full px-3 py-2 rounded border border-gray-300"
                            >
                                <option value="string">Text</option>
                                <option value="number">Number</option>
                                <option value="boolean">Yes / No</option>
                            </select>
                        </div>

                        <button
                            type="button"
                            onClick={() => addAttribute(customDescriptor)}
                            className="submit-button"
                            disabled={!customDescriptor.trim()}
                        >
                            Create
                        </button>
                    </div>

                    {formData.selectedItemAttributes.length > 0 && (
                        <div style={{ marginTop: '1rem' }}>
                            {formData.selectedItemAttributes.map(attribute => (
                                <div
                                    key={attribute.descriptor}
                                    style={{
                                        border: '1px solid #d1d5db',
                                        borderRadius: '0.5rem',
                                        padding: '1rem',
                                        marginBottom: '0.75rem',
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            flexWrap: 'wrap',
                                        }}
                                    >
                                        <strong>{attribute.descriptor}</strong>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeAttribute(
                                                    attribute.descriptor,
                                                )
                                            }
                                            className="back-button"
                                        >
                                            Remove
                                        </button>
                                    </div>

                                    <div
                                        style={{
                                            display: 'flex',
                                            gap: '0.75rem',
                                            flexWrap: 'wrap',
                                            marginTop: '0.75rem',
                                            alignItems: 'end',
                                        }}
                                    >
                                        <div style={{ flex: '0 0 140px' }}>
                                            <label className="block text-sm font-semibold mb-1">
                                                Type
                                            </label>
                                            <div className="w-full px-3 py-2 rounded border border-gray-300 bg-gray-50">
                                                {formatAttributeTypeLabel(
                                                    attribute.valueType,
                                                )}
                                            </div>
                                        </div>

                                        {attribute.valueType === 'boolean' ? (
                                            <div style={{ flex: '1 1 220px' }}>
                                                <label className="block text-sm font-semibold mb-1">
                                                    Value
                                                </label>
                                                <select
                                                    value={
                                                        attribute.booleanValue ===
                                                        null
                                                            ? ''
                                                            : String(
                                                                  attribute.booleanValue,
                                                              )
                                                    }
                                                    onChange={e =>
                                                        updateAttribute(
                                                            attribute.descriptor,
                                                            {
                                                                booleanValue:
                                                                    e.target
                                                                        .value ===
                                                                    ''
                                                                        ? null
                                                                        : e
                                                                              .target
                                                                              .value ===
                                                                          'true',
                                                            },
                                                        )
                                                    }
                                                    className="w-full px-3 py-2 rounded border border-gray-300"
                                                >
                                                    <option value="">
                                                        Select value
                                                    </option>
                                                    <option value="true">
                                                        Yes
                                                    </option>
                                                    <option value="false">
                                                        No
                                                    </option>
                                                </select>
                                            </div>
                                        ) : (
                                            <div style={{ flex: '1 1 220px' }}>
                                                <label className="block text-sm font-semibold mb-1">
                                                    Value
                                                </label>
                                                <input
                                                    type={
                                                        attribute.valueType ===
                                                        'number'
                                                            ? 'number'
                                                            : 'text'
                                                    }
                                                    value={attribute.value}
                                                    onChange={e =>
                                                        updateAttribute(
                                                            attribute.descriptor,
                                                            {
                                                                value: e.target
                                                                    .value,
                                                            },
                                                        )
                                                    }
                                                    className="w-full px-3 py-2 rounded border border-gray-300"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
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
                    value={String(formData[name] ?? '')}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 rounded border ${errors[name] ? 'border-red-500' : 'border-gray-300'}`}
                    disabled={name === 'currentStatus' || name === 'quantity'}
                    min={name === 'quantity' ? 1 : undefined}
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
                {renderFormField('Category', 'category')}
                {renderFormField('Quantity', 'quantity', 'number')}
                {renderFormField('Date Donated', 'dateDonated', 'date')}
                {renderFormField('Images (Max 5)', 'imageFiles', 'file', false)}
                {renderFormField(
                    'Attributes',
                    'selectedItemAttributes',
                    'select',
                    false,
                    attributeOptions,
                )}

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
