import axios from 'axios';

export type AttributeValueType = 'string' | 'number' | 'boolean';

export interface AttributeDefinition {
    descriptor: string;
    valueType: AttributeValueType;
}

export interface SelectedAttribute {
    descriptor: string;
    valueType: AttributeValueType;
    value: string;
    booleanValue: boolean | null;
}

export interface AttributeOption {
    value: string; // keep as string for <select>, store numeric id separately in id
    label: string;
    id?: number;
    valueType?: AttributeValueType;
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
        getDefaultDescriptorsForItemType('')
            .reduce((acc, definition) => {
                const normalized = normalizeDescriptor(definition.descriptor);
                if (!acc.has(normalized)) {
                    acc.set(normalized, definition);
                }
                return acc;
            }, new Map<string, AttributeDefinition>())
            .values(),
    ).sort((a, b) => a.descriptor.localeCompare(b.descriptor));

export const formatAttributeTypeLabel = (valueType: AttributeValueType) => {
    if (valueType === 'number') return 'Number';
    if (valueType === 'boolean') return 'Yes / No';
    return 'Text';
};

export const fetchAttributes = async (
    itemType: string,
): Promise<AttributeOption[]> => {
    const defaultDefinitions = getDefaultDescriptorsForItemType(itemType);

    try {
        const response = await axios.get(
            `${process.env.REACT_APP_BACKEND_API_BASE_URL}donatedItem/attributes`,
            {
                params: itemType ? { itemType: itemType } : undefined,
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
        ).sort((a, b) => a.descriptor.localeCompare(b.descriptor));

        return uniqueDescriptors.map(definition => ({
            value: definition.descriptor,
            label: definition.descriptor,
            valueType: definition.valueType,
        }));
    } catch (error) {
        console.error('Error fetching attributes:', error);
        return defaultDefinitions.map(definition => ({
            value: definition.descriptor,
            label: definition.descriptor,
            valueType: definition.valueType,
        }));
    }
};

export const serializeAttributes = (
    selectedItemAttributes: SelectedAttribute[] | undefined,
) => {
    return JSON.stringify(
        (selectedItemAttributes ?? [])
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
                        attribute.valueType === 'string' ? trimmedValue : null,
                    numberValue:
                        attribute.valueType === 'number'
                            ? Number(trimmedValue)
                            : null,
                    booleanValue: null,
                };
            })
            .filter(Boolean),
    );
};
