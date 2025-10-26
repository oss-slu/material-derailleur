import { Router, Request, Response } from 'express';
import prisma from '../prismaClient'; // Import Prisma client
import { body, validationResult } from 'express-validator';
import { sendPasswordReset } from '../services/emailService';
import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import z from 'zod';
import { passwordRegex } from './programRoutes';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET; // Use secret from .env
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not set in .env file!');
}

router.post(
    '/forgotpassword',
    [body('email').isEmail().withMessage('Invalid email format')],
    async (req: Request, res: Response) => {
        const { email } = req.body;

        try {
            // Find user in the database
            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) {
                return res.status(401).json({
                    message: 'Email not found',
                });
            }

            // Generate JWT token and it expires in 1hr.
            const token = jwt.sign(
                { userId: user.id, email: user.email },
                JWT_SECRET,
                { expiresIn: '1h' },
            );

            try {
                await sendPasswordReset(email, token);
                res.json({ message: 'Password reset email sent' });
            } catch (error) {
                console.error('Error sending reset email:', error);
                res.status(500).json({ message: 'Error sending email' });
            }
        } catch (error) {
            console.error('Server Error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },
);

const passwordSchema = z
      .string()
      .min(12, { message: "Password must be at least 12 characters" })
      .regex(passwordRegex, {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
      })
router.post('/reset-password', async (req: Request, res: Response) => {
    const { token, password } = req.body;

    if (!token || !password) {
        return res
            .status(400)
            .json({ message: 'Token and password are required' });
    }

    const parsedPassword = passwordSchema.safeParse(password)
    if (!parsedPassword.success){
        res.status(411).json({
            message : parsedPassword.error.message 
        })
        return
    }
    const isJwt = token.split('.').length === 3; // Check if it's a JWT
    if (isJwt) {
        // Handle Forgot Password (JWT Token)
        try {
            let decoded: JwtPayload;
            decoded = jwt.verify(token, JWT_SECRET) as JwtPayload; // Decode and verify the token
            const userId = decoded.userId;
            const hashedPassword = await bcrypt.hash(parsedPassword.data, 10);

            // Store new password in database
            // const updatedUser =
            await prisma.user.update({
                where: { id: userId },
                data: { password: hashedPassword }, // The new hashed password
            });

            return res.status(200).json({
                message: 'Password changed successfully',
            });
        } catch (error) {
            console.log('Login Error. JWT validation failed.');
            return res
                .status(401)
                .json({ message: 'Invalid or expired token.' });
        }
    } else {
        try {
            const hashedToken = crypto
                .createHash('sha256')
                .update(token)
                .digest('hex');

            const user = await prisma.user.findFirst({
                where: {
                    resetToken: hashedToken,
                    resetTokenExpiry: { gte: new Date() },
                },
            });
            if (!user) {
                return res.status(400).json({
                    message:
                        'Invalid or expired reset token. Please submit another password reset request.',
                });
            }

            if (user.firstLogin && user.role === 'DONOR') {
                const newHashedPassword = await bcrypt.hash(password, 10);

                await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        password: newHashedPassword,
                        resetToken: null,
                        resetTokenExpiry: null,
                        firstLogin: false, // Mark as completed
                    },
                });

                return res
                    .status(200)
                    .json({ message: 'Password reset successful' });
            }
        } catch (error) {
            console.error('Error during first login token flow:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
});

export default router;
