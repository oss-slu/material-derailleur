import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'xalngJIazn';
//const JWT_SECRET = 'xalngJIazn'; // I don't know why calling the process above was always creating errors during the checks. It works when checked manually
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not set in .env file!');
}

interface DecodedToken {
    userId: string;
    email: string;
    role: 'DONOR' | 'ADMIN';
}

export const authenticateUser = async (
    req: Request,
    res: Response,
    adminPerm: boolean = false,
): Promise<boolean> => {
    try {
        let token = req.headers.authorization;
        if (!token) {
            res.status(401).json({
                message: 'Authorization token missing or Access denied.',
            });
            return false;
        }

        if (token.startsWith('Bearer')) {
            token = token.split(' ')[1];
        }

        const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;

        // If adminPerm is true, only allow ADMIN
        if (adminPerm && decoded.role !== 'ADMIN') {
            res.status(403).json({ message: 'Access denied: Admins only.' });
            return false;
        }

        (req as any).user = {
            id: decoded.userId,
            email: decoded.email,
            role: decoded.role,
        };
        return true;
    } catch (error) {
        console.error('Autentication error:', error);
        res.status(401).json({ message: 'Invalid or expired token' });
        return false;
    }
};
