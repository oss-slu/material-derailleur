import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ResetPasswordPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [token, setToken] = useState<string | null>(null);

    const email: string | undefined = location.state?.email;

    // Extract token from URL
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const resetToken = queryParams.get('token');
        if (resetToken) {
            setToken(resetToken);
        } else {
            setError('Invalid or missing reset token.');
        }
    }, [location]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (password !== confirmPassword) {
                setError('Passwords do not match');
                return;
            }

            if (password.length < 12) {
                setError('Password must be at least 12 characters');
                return;
            }

            if (email && password.includes(email)) {
                setError('Password must not contain email');
                return;
            }

            const missing: string[] = [];

            if (!/[A-Z]/.test(password)) missing.push('an uppercase');
            if (!/[a-z]/.test(password)) missing.push('a lowercase');
            if (!/[0-9]/.test(password)) missing.push('a number');
            if (!/[^\w\s]/.test(password)) missing.push('a special character');

            if (missing.length > 0) {
                setError(`Password must contain ${missing.join(', ')}!`);
                return;
            }
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_API_BASE_URL}passwordReset/reset-password`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token, password }),
                },
            );

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }
            setMessage(data.message);
            setTimeout(() => navigate('/login'), 3000);
        } catch (error) {
            console.error('Error resetting password:', error);
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'An unknown error occurred';
            if (errorMessage.includes('expired')) {
                setError(
                    'This link has expired. Please submit another password reset request.',
                );
            } else if (errorMessage.includes('Invalid')) {
                setError(
                    'This token is no longer valid. Please ensure that the URL is correct or submit another password reset request.',
                );
            } else if (errorMessage.includes('Authentication')) {
                setError(
                    'Token authentication failed. Please ensure that the URL is correct or submit another password reset request.',
                );
            } else {
                setError('Error resetting password. Please try again.');
            }
        }
    };

    return (
        <div>
            <h2>Reset Password</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="New Password"
                    required
                />
                <input
                    type="password"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                    required
                />
                {error && <div className="alert alert-danger">{error}</div>}
                {message && (
                    <div className="alert alert-success">{message}</div>
                )}
                <button type="submit">Reset Password</button>
            </form>
        </div>
    );
};

export default ResetPasswordPage;
