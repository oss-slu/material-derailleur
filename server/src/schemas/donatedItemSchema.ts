import Joi from 'joi';

// DonatedItem schema
export const donatedItemSchema = Joi.object({
    itemType: Joi.string().trim().required(),

    currentStatus: Joi.string()
        .valid(
            'Received',
            'Donated',
            'In storage facility',
            'Refurbished',
            'Item sold',
        )
        .required(),

    donorId: Joi.alternatives()
        .try(Joi.number().integer().positive(), Joi.string().pattern(/^\d+$/))
        .required()
        .messages({
            'string.pattern.base':
                'donorId must be either a number or a numeric string',
        }),

    programId: Joi.alternatives()
        .try(
            Joi.number().integer().positive(),
            Joi.string().pattern(/^\d+$/),
            Joi.string().allow('').empty(''), // allow empty string from form-data
        )
        .optional()
        .messages({
            'string.pattern.base':
                'programId must be either a number or a numeric string',
        }),

    // Accepts Date or ISO string (e.g., "2025-11-14")
    dateDonated: Joi.alternatives()
        .try(Joi.date().iso(), Joi.string().isoDate())
        .required(),

    // NEW fields you’re sending from the client
    category: Joi.string().trim().required(),
    quantity: Joi.alternatives()
        .try(Joi.number().integer().min(1), Joi.string().pattern(/^\d+$/))
        .required(),

    // From form-data, will be "true"/"false" strings → coerce in validator
    optOutAnalysis: Joi.boolean().truthy('true').falsy('false').default(false),
}).unknown(true); // allow extra keys from multer, etc.

// DonatedItemStatus schema
export const donatedItemStatusSchema = Joi.object({
    statusType: Joi.string()
        .valid(
            'Received',
            'Donated',
            'In storage facility',
            'Refurbished',
            'Item sold',
        )
        .required(),
    donatedItemId: Joi.alternatives()
        .try(Joi.number().integer(), Joi.string().pattern(/^\d+$/))
        .required(),
    dateModified: Joi.alternatives()
        .try(Joi.date().iso(), Joi.string().isoDate())
        .optional(),
});
