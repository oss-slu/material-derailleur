import { Router, Request, Response } from 'express';
import prisma from '../prismaClient'; // Import Prisma client
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authenticateUser } from './routeProtection';
import crypto from 'crypto';
import { sendPasswordReset } from '../services/emailService';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET; // Use secret from .env
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not set in .env file!');
}

// Route to register a new user
router.post(
    '/register',
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('email')
            .trim()
            .isEmail()
            .withMessage('Invalid email format')
            .normalizeEmail(),
        body('password')
            .isLength({ min: 5 })
            .withMessage('Password must be at least 5 characters'),
    ],
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password } = req.body;

        try {
            // Check if user already exists
            const existingUser = await prisma.user.findUnique({
                where: { email },
            });
            if (existingUser) {
                return res
                    .status(400)
                    .json({ message: 'Email already in use' });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Store user in database
            const user = await prisma.user.create({
                data: { name, email, password: hashedPassword, role: 'ADMIN' },
            });

            return res.status(201).json({
                message: 'User registered successfully',
                userId: user.id,
            });
        } catch (error) {
            console.error('Error registering user:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },
);

// Route to login user
router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Invalid email format'),
        body('password').notEmpty().withMessage('Password is required'),
    ],
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            // Find user in the database
            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) {
                return res.status(401).json({
                    message:
                        'Invalid email, please register to proceed with login.',
                });
            }

            // Compare passwords using bcrypt
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid password.' });
            }

            // First Login: Force Password Reset
            if (user.firstLogin && user.role === 'DONOR') {
                // Generate a secure token
                const rawToken = crypto.randomBytes(32).toString('hex');
                const hashedToken = crypto
                    .createHash('sha256')
                    .update(rawToken)
                    .digest('hex');
                const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 60 minutes

                // Save token and expiry in the user record
                await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        resetToken: hashedToken,
                        resetTokenExpiry: expiresAt,
                    },
                });

                // Send reset email with the raw token
                await sendPasswordReset(user.email, rawToken);

                return res.status(403).json({
                    message:
                        'Please reset your password using the link sent to your email.',
                    requireReset: true,
                });
            }

            // Generate JWT token and it expires in 1hr.
            const token = jwt.sign(
                { userId: user.id, email: user.email, role: user.role },
                JWT_SECRET,
                { expiresIn: '1h' },
            );

            return res.status(200).json({
                message: 'Login successful',
                token,
                name: user.name,
                role: user.role,
            });
        } catch (error) {
            console.error('Login Error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },
);

// Route to create a new program
router.post('/', async (req: Request, res: Response) => {
    try {
        const permGranted = await authenticateUser(req, res, true);
        if (permGranted) {
            const { name, description, startDate, aimAndCause } = req.body;

            // Convert the date to include time (e.g., "YYYY-MM-DDT00:00:00Z")
            const dateTime = new Date(`${startDate}T00:00:00Z`);

            // Create the new program with the full DateTime for startDate
            const newProgram = await prisma.program.create({
                data: {
                    name,
                    description,
                    startDate: dateTime, // Pass the DateTime to backend
                    aimAndCause,
                },
            });
            res.status(201).json(newProgram);
        }
    } catch (error) {
        console.error('Error creating program:', error);
        res.status(500).json({ message: 'Error creating program' });
    }
});

// Route to get all programs
router.get('/', async (req: Request, res: Response) => {
    try {
        const permGranted = await authenticateUser(req, res, false);
        if (permGranted) {
            const programs = await prisma.program.findMany();
            res.json(programs);
        }
    } catch (error) {
        console.error('Error fetching programs:', error);
        res.status(500).json({ message: 'Error fetching programs' });
    }
});

router.post('/edit', async (req: Request, res: Response) => {
    try {
        const program = req.body;

        // Convert the date to include time (e.g., "YYYY-MM-DDT00:00:00Z")
        const dateTime = new Date(`${program.startDate}T00:00:00Z`);

        // Create the new program with the full DateTime for startDate
        const editProgram = await prisma.program.update({
            where: {
                id: program.id,
            },
            data: {
                name: program.name,
                description: program.description,
                startDate: dateTime, // Pass the DateTime to backend
                aimAndCause: program.aimAndCause,
            },
        });
        res.status(200).json(editProgram);
    } catch (error) {
        console.error('Error editing program:', error);
        res.status(500).json({ message: 'Error editing program' });
    }
});

export default router;
