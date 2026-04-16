import React from 'react';
import {
    type AttributeValueType,
    type SelectedAttribute,
    type AttributeOption,
    formatAttributeTypeLabel,
} from '../constants/attributeDefinitions';

export interface AttributeEditorProps {
    selectedItemAttributes: SelectedAttribute[];
    attributeOptions: AttributeOption[];
    selectedDescriptor: string;
    customDescriptor: string;
    customAttributeType: AttributeValueType;
    onSelectedDescriptorChange: (value: string) => void;
    onCustomDescriptorChange: (value: string) => void;
    onCustomAttributeTypeChange: (value: AttributeValueType) => void;
    onAddAttribute: (descriptorInput?: string) => void;
    onRemoveAttribute: (descriptor: string) => void;
    onUpdateAttribute: (
        descriptor: string,
        updates: Partial<SelectedAttribute>,
    ) => void;
}

const AttributeEditor: React.FC<AttributeEditorProps> = ({
    selectedItemAttributes,
    attributeOptions,
    selectedDescriptor,
    customDescriptor,
    customAttributeType,
    onSelectedDescriptorChange,
    onCustomDescriptorChange,
    onCustomAttributeTypeChange,
    onAddAttribute,
    onRemoveAttribute,
    onUpdateAttribute,
}) => {
    return (
        <div className="attribute-editor">
            {/* Pick descriptor section */}
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
                            onSelectedDescriptorChange(e.target.value)
                        }
                        className="w-full px-3 py-2 rounded border border-gray-300"
                    >
                        <option value="">Select descriptor</option>
                        {attributeOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    type="button"
                    onClick={() => onAddAttribute()}
                    className="submit-button"
                    disabled={!selectedDescriptor}
                >
                    Add
                </button>
            </div>

            {/* Create custom descriptor section */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns:
                        'minmax(220px, 1fr) minmax(160px, 220px) auto',
                    gap: '0.75rem',
                    alignItems: 'start',
                    marginTop: '1rem',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
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
                        onChange={e => onCustomDescriptorChange(e.target.value)}
                        placeholder="e.g. serial number"
                        className="w-full px-3 py-2 rounded border border-gray-300"
                    />
                </div>

                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <label className="block text-sm font-semibold mb-1">
                        Type
                    </label>
                    <select
                        value={customAttributeType}
                        onChange={e =>
                            onCustomAttributeTypeChange(
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

                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <label
                        className="block text-sm font-semibold mb-1"
                        style={{ visibility: 'hidden' }}
                    >
                        Action
                    </label>
                    <button
                        type="button"
                        onClick={() => onAddAttribute(customDescriptor)}
                        className="submit-button"
                        disabled={!customDescriptor.trim()}
                    >
                        Create
                    </button>
                </div>
            </div>

            {/* Selected attributes list */}
            {selectedItemAttributes.length > 0 && (
                <div style={{ marginTop: '1rem' }}>
                    {selectedItemAttributes.map(attribute => (
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
                                        onRemoveAttribute(attribute.descriptor)
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
                                                attribute.booleanValue === null
                                                    ? ''
                                                    : String(
                                                          attribute.booleanValue,
                                                      )
                                            }
                                            onChange={e =>
                                                onUpdateAttribute(
                                                    attribute.descriptor,
                                                    {
                                                        booleanValue:
                                                            e.target.value ===
                                                            ''
                                                                ? null
                                                                : e.target
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
                                            <option value="true">Yes</option>
                                            <option value="false">No</option>
                                        </select>
                                    </div>
                                ) : (
                                    <div style={{ flex: '1 1 220px' }}>
                                        <label className="block text-sm font-semibold mb-1">
                                            Value
                                        </label>
                                        <input
                                            type={
                                                attribute.valueType === 'number'
                                                    ? 'number'
                                                    : 'text'
                                            }
                                            value={attribute.value}
                                            onChange={e =>
                                                onUpdateAttribute(
                                                    attribute.descriptor,
                                                    {
                                                        value: e.target.value,
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
    );
};

export default AttributeEditor;
