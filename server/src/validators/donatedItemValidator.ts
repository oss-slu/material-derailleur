import { Request, Response, NextFunction } from 'express';
import { donatedItemSchema } from '../schemas/donatedItemSchema';

export const donatedItemValidator = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { value, error } = donatedItemSchema.validate(req.body, {
        convert: true, // coerce "1"->1, "false"->false, ISO date -> Date
        abortEarly: false, // report all validation issues
    });

    if (error) {
        return res.status(400).json({
            message: error.details.map(d => d.message).join(', '),
        });
    }

    // Normalize optional programId: treat empty string from form-data as null
    if (value.programId === '') value.programId = null;

    req.body = value;
    next();
};
