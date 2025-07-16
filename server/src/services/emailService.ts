import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import prisma from '../prismaClient';
import { fetchSASUrls } from './donatedItemService';

dotenv.config(); // Load environment variables

// Configure the email transporter with SMTP
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, // SMTP server host
    port: parseInt(process.env.SMTP_PORT || '587'), // SMTP port
    secure: process.env.SMTP_SECURE === 'true', // Use TLS if set
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    // debug: true, // Enables SMTP debug logs
    // logger: true, // Logs the entire email transaction
});

// Test transporter connection
transporter.verify((error, success) => {
    if (error) {
        console.log('SMTP Connection Error:', error);
    }
});

// Function to send a welcome email to a new donor
export const sendWelcomeEmail = async (
    recipientEmail: string,
    donorName: string,
) => {
    const mailOptions = {
        from: `Donation Team <${process.env.SMTP_USER}>`,
        to: recipientEmail,
        subject: 'Welcome to Our Donation Program!',
        html: `
            <h2>Dear ${donorName},</h2>
            <p>Thank you for joining our donation program. Your support makes a real difference!</p>
            <p>We truly appreciate your generosity and look forward to working together for a great cause.</p>
            <p>Best regards,</p>
            <p><strong>Donation Team</strong></p>
        `,
    };

    try {
        const result = await transporter.sendMail(mailOptions);
        transporter.close();
    } catch (error) {
        console.log('❌ Error sending email:', error);
    }
};

// Function to send a password reset

export const sendPasswordReset = async (
    recipientEmail: string,
    resetToken: string,
) => {
    const resetUrl = `${process.env.FRONTEND_URL}reset-password?token=${resetToken}`;
    const mailOptions = {
        from: `Donation Team <${process.env.SMTP_USER}>`,
        to: recipientEmail,
        subject: 'Material Donor Mutual Assist Password Reset',
        html: `
            <h2>Hello there!</h2>
            <<p>We received a request to reset your password. If this was you, click the link below:</p>
            <p><a href="${resetUrl}" style="color: blue; text-decoration: underline;">${resetUrl}</a></p>
            <p><strong>This link will expire in 60 minutes.</strong></p>
            <p>If this wasn’t you, please ignore this email.</p>
            <p>Best regards,</p>
            <p><strong>Donation Team</strong></p>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Password reset email sent to ${recipientEmail}`);
        transporter.close();
    } catch (error) {
        console.log('Error sending email:', error);
    }
};

// Function to send a donation confirmation email

export const sendDonationEmail = async (
    recipientEmail: string,
    donorName: string,
    itemType: string,
    dateDonated: Date,
    imageUrls: string[],
) => {
    const SASUrls = await fetchSASUrls(imageUrls);

    // Extract image URLs (flatten in case of multiple statuses)
    // const base64Images = await Promise.all(

    //         item.imageUrls.map(async (url) => await convertImageToBase64(url))
    //     )
    // );
    const formattedDate = dateDonated.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC',
    });
    const imageSection =
        SASUrls.length > 0
            ? `<p>Here are the images of your donation:</p>
           <div>${SASUrls.map(
               (url: string) => `<img src="${url}"  
            alt="Donation Image" width="200" style="margin:5px; border-radius:8px; max-width:100%;">`,
           ).join('')}</div>`
            : `<p>No images were provided for this donation.</p>`;

    const mailOptions = {
        from: `Donation Team <${process.env.SMTP_USER}>`,
        to: recipientEmail,
        subject: 'Donation Confirmation',
        html: `
            <h2>Dear ${donorName},</h2>
            <p>Thank you for your generous donation!</p>
            <p>We received your <strong>${itemType}</strong> on <strong>${formattedDate}</strong>.</p>
            ${imageSection}
            
            <p>We truly appreciate your support.</p>
            <p>Best regards,</p>
            <p><strong>Donation Team, BWorks</strong></p>
        `,
    };

    try {
        const result = await transporter.sendMail(mailOptions);
        console.log('✅ Donation confirmation email sent:', result);
    } catch (error) {
        console.log('❌ Error sending donation email:', error);
    }
};
