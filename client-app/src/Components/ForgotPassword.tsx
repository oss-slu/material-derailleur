import React, { useState, ChangeEvent, FormEvent } from 'react';
import emailjs from 'emailjs-com';
import { useNavigate } from 'react-router-dom';

const ForgotPassword: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_API_BASE_URL}passwordReset/forgotpassword`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email }),
                },
            );

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }
            console.log('Email sent:', data.message);
            alert('A password reset link has been sent to your email.');
        } catch (error) {
            console.error('Error sending password reset email:', error);
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'An unknown error occurred';
            if (errorMessage.includes('not found')) {
                alert('That email is not linked to a registered account.');
            } else if (errorMessage.includes('sending email')) {
                alert(
                    'There was an error sending the reset email. Please try again.',
                );
            } else {
                alert(error);
            }
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    return (
        <div>
            <h2>Forgot Password</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    value={email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default ForgotPassword;
