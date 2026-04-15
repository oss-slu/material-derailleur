export type AttributeValueType = 'string' | 'number' | 'boolean';

export interface AttributeDefinition {
    descriptor: string;
    valueType: AttributeValueType;
}

export const DEFAULT_ATTRIBUTE_DEFINITIONS_BICYCLE: AttributeDefinition[] = [
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

export const DEFAULT_ATTRIBUTE_DEFINITIONS_COMPUTER: AttributeDefinition[] = [
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

export const normalizeDescriptor = (value?: string | null) =>
    value?.trim().toLowerCase() || '';

export const getDefaultDescriptorsForItemType = (itemType: string) => {
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

export const getAllDefaultAttributeDefinitions = () =>
    Array.from(
        getDefaultDescriptorsForItemType('').reduce((acc, definition) => {
            const normalized = normalizeDescriptor(definition.descriptor);
            if (!acc.has(normalized)) {
                acc.set(normalized, definition);
            }
            return acc;
        }, new Map<string, AttributeDefinition>()).values(),
    ).sort((a, b) => a.descriptor.localeCompare(b.descriptor));

export const formatAttributeTypeLabel = (valueType: AttributeValueType) => {
    if (valueType === 'number') return 'Number';
    if (valueType === 'boolean') return 'Yes / No';
    return 'Text';
};
