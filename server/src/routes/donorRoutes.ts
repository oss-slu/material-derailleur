import { Router, Request, Response } from 'express';
import prisma from '../prismaClient'; // Import Prisma client
import { donorValidator } from '../validators/donorValidator';
import {
    sendWelcomeEmail,
    sendPasswordReset,
    sendAccountUpdateEmail,
    sendApprovalRequestEmail,
} from '../services/emailService';
import express from 'express';
import { authenticateUser } from './routeProtection';
import bcrypt from 'bcryptjs';
import crypto from 'crypto'; // Make sure this is imported

import jwt from 'jsonwebtoken';

const router = Router();
// Interface for email and name to string to avoid implicit type error 
interface Donor {
  email: string;
  name?: string; 
}

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

router.get('/emails', async (req: Request, res: Response) => {
    try {
        const permGranted = await authenticateUser(req, res, true);
        if (!permGranted) {
            return;
        }

        const donors = await prisma.donor.findMany({
            select: { email: true },
        });

      const donorEmails = donors.map(({ email}) => email);
  
        res.json(donorEmails);
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

        // Store user in database (donors start as PENDING until approved)
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: 'DONOR',
                status: 'PENDING',
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

        // Find all active admins
        const admins = await prisma.user.findMany({
            where: { role: 'ADMIN', status: 'ACTIVE' },
            select: {
                id: true,
                name: true,
                email: true,
            },
        });

        if (admins && admins.length > 0) {
            // If admins exist
            // Inform all admins of new account
            for (const admin of admins) {
                await sendApprovalRequestEmail(
                    admin.email,
                    admin.name,
                    user.name,
                    user.email,
                );
                console.log(`Approval request email sent to ${admin.email}`);
            }
        } else {
            console.warn(
                'There are no active admins. It will not be possible to approve anyone until an active admin is created.',
            );
        }

        return res.status(201).json({
            message: 'User registered. Please wait for approval from an admin.',
            userId: user.id,
            password: donorPassword,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error registering donor' });
    }
});

// Admin: list PENDING user accounts
router.get('/pending', async (req: Request, res: Response) => {
    try {
        const permGranted = await authenticateUser(req, res, true);
        if (!permGranted) return;

        const pendingUsers = await prisma.user.findMany({
            where: { status: 'PENDING' },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });

        res.json(pendingUsers);
    } catch (error) {
        console.error('Error fetching pending users:', error);
        res.status(500).json({ message: 'Error fetching pending users' });
    }
});

// Admin: list ALL user accounts (including status)
router.get('/users', async (req: Request, res: Response) => {
    try {
        const permGranted = await authenticateUser(req, res, true);
        if (!permGranted) return;

        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users' });
    }
});

// Admin: update user's status and/or role
router.put('/users/:userId', async (req: Request, res: Response) => {
    try {
        const permGranted = await authenticateUser(req, res, true);
        if (!permGranted) return;

        const { userId } = req.params;
        const { role, status } = req.body as { role?: string; status?: string };

        // Get current user information
        const currentUser = await prisma.user.findUnique({
            where: { id: String(userId) },
        });

        if (!currentUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Make sure to update only valid roles/statuses
        const allowedRoles = ['ADMIN', 'DONOR'];
        const allowedStatuses = ['PENDING', 'ACTIVE', 'SUSPENDED'];

        const dataToUpdate: any = {};
        // Check if any updates happened
        if (role && allowedRoles.includes(role) && role !== currentUser.role)
            dataToUpdate.role = role;
        if (
            status &&
            allowedStatuses.includes(status) &&
            status !== currentUser.status
        )
            dataToUpdate.status = status;

        // If no updates happened, don't send a request
        if (Object.keys(dataToUpdate).length === 0) {
            return res
                .status(200)
                .json({ message: 'No valid fields to update' });
        }

        // Updates happened, send a request
        const updatedUser = await prisma.user.update({
            where: { id: String(userId) },
            data: dataToUpdate,
        });

        res.status(200).json({ message: 'User updated', user: updatedUser });

        // Inform the person updated that they were updated, along with their new role and status
        await sendAccountUpdateEmail(
            updatedUser.email,
            updatedUser.name,
            updatedUser.role || 'User',
            updatedUser.status,
        );
        console.log(`Account status update email sent to ${updatedUser.email}`);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Error updating user' });
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
