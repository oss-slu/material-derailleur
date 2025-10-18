import { Router, Request, Response } from 'express';
import prisma from '../prismaClient'; // Import Prisma client
import { donorValidator } from '../validators/donorValidator';
import { sendWelcomeEmail, sendPasswordReset } from '../services/emailService';
import express from 'express';
import { authenticateUser } from './routeProtection';
import bcrypt from 'bcryptjs';
import crypto from 'crypto'; // Make sure this is imported

import jwt from 'jsonwebtoken';

const router = Router();

router.post('/', donorValidator, async (req: Request, res: Response) => {
    try {
        const permGranted = await authenticateUser(req, res, true);
        if (permGranted) {
            const newDonor = await prisma.donor.create({
                data: req.body,
            });
            console.log('New donor created:', newDonor);

            // Send a welcome email asynchronously
            try {
                await sendWelcomeEmail(
                    newDonor.email,
                    `${newDonor.firstName} ${newDonor.lastName}`,
                );
                console.log('Welcome email sent successfully');
            } catch (emailError) {
                console.log('Failed to send welcome email:', emailError);
            }

            res.status(201).json(newDonor);
        }
    } catch (error) {
        console.log('Error creating donor:', error);
        res.status(500).json({ message: 'Error creating donor' });
    }
});

router.get('/', async (req: Request, res: Response) => {
    try {
        const permGranted = await authenticateUser(req, res, true);
        if (permGranted) {
            const donors = await prisma.donor.findMany();
            res.json(donors);
        }
    } catch (error) {
        console.log('Error fetching donor:', error);
        res.status(500).json({ message: 'Error fetching donors' });
    }
});

// Admin-only endpoint to fetch list of donor emails
router.get('/emails', async (req: Request, res: Response) => {
    try {
        const permGranted = await authenticateUser(req, res, true);
        if (permGranted) {
            const emails = await prisma.donor.findMany({
                select: { email: true },
            });
            res.json(emails.map((e) => e.email));
        }
    } catch (error) {
        console.error('Error fetching donor emails:', error);
        res.status(500).json({ message: 'Error fetching donor emails' });
    }
});

function getRandomPassword() {
    const charset =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890$&+,:;=?@#|'<>.^*()%!-";
    let valid = false;
    let password = '';
    const indicies = new Uint8Array(16);
    while (!valid) {
        password = '';
        crypto.getRandomValues(indicies);
        for (const i of indicies) {
            password += charset[i % charset.length];
        }
        valid =
            password.match(/[$&+,:;=?@#|'<>.^*()%!-]/) != null &&
            password.match(/[A-Z]/) != null &&
            password.match(/[a-z]/) != null &&
            password.match(/[0-9]/) != null;
    }
    return password;
}
router.post('/register', async (req: Request, res: Response) => {
    try {
        const { name, email } = req.body;
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }
        const donorPassword = getRandomPassword();
        const hashedPassword = await bcrypt.hash(donorPassword, 10);

        // Store user in database
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: 'DONOR',
                firstLogin: true,
            },
        });

        const rawToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto
            .createHash('sha256')
            .update(rawToken)
            .digest('hex');
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetToken: hashedToken,
                resetTokenExpiry: expiresAt,
            },
        });

        await sendPasswordReset(user.email, rawToken);
        console.log(`Password reset email sent to ${user.email}`);

        return res.status(201).json({
            message: 'User registered successfully',
            userId: user.id,
            password: donorPassword,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error registering donor' });
    }
});

router.post('/edit', async (req: Request, res: Response) => {
    const donor = req.body;
    const donorId = parseInt(donor.id);
    const oldEmail = donor.old;
    try {
        const updateDonor = await prisma.donor.update({
            where: {
                id: donorId,
            },
            data: {
                firstName: donor.firstName,
                lastName: donor.lastName,
                contact: donor.contact,
                email: donor.email,
                addressLine1: donor.addressLine1,
                addressLine2: donor.addressLine2,
                state: donor.state,
                city: donor.city,
                zipcode: donor.zipcode,
                emailOptIn: donor.emailOptIn,
            },
        });

        const updateUser = await prisma.user.update({
            where: {
                email: oldEmail,
            },
            data: {
                name: donor.firstName,
                email: donor.email,
            },
        });
        res.status(200).json({ ...updateDonor, ...updateUser });
    } catch (error) {
        console.log('Error fetching donor:', error);
        res.status(500).json({ message: 'Error fetching donor' });
    }
});

router.get('/me', async (req: Request, res: Response) => {
    const permitted = await authenticateUser(req, res, false); // Donor or Admin
    if (!permitted) return;

    const user = (req as any).user;

    try {
        const profile = await prisma.donor.findFirst({
            // Would not let me run it with unique

            // FUTURE ME, REVERT BACK TO findUnique!!!!
            where: { email: user.email },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                contact: true,
                addressLine1: true,
                addressLine2: true,
                city: true,
                state: true,
                zipcode: true,
                emailOptIn: true,
            },
        });

        const donations = await prisma.donatedItem.findMany({
            where: { donorId: profile?.id },
        });

        res.json({ profile, donations });
    } catch (error) {
        console.error('Error fetching donor data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
