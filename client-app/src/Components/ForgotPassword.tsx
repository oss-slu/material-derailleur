import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../css/ForgotPassword.css';

const ForgotPassword: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const validateEmail = (mail: string) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!validateEmail(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_API_BASE_URL}passwordReset/forgotpassword`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email }),
                },
            );

            const data = await response.json().catch(() => ({}));
            if (response.ok) {
                setSuccess(
                    'If this email is registered, a reset link has been sent.',
                );
                // Optionally redirect after a short delay:
                // setTimeout(() => navigate('/login'), 2500);
            } else {
                setError(
                    data.message ||
                        'Unable to process request. Try again later.',
                );
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        setError('');
        setSuccess('');
    };

    return (
        <div className="fp-page">
            <div className="fp-card">
                <h2 className="fp-title">Forgot Password</h2>

                {error && <div className="fp-message fp-error">{error}</div>}
                {success && (
                    <div className="fp-message fp-success">{success}</div>
                )}

                <form className="fp-form" onSubmit={handleSubmit} noValidate>
                    <label htmlFor="fp-email" className="fp-label">
                        Enter your email address
                    </label>
                    <input
                        id="fp-email"
                        type="email"
                        className="fp-input"
                        value={email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        required
                    />

                    <div className="fp-actions">
                        <button
                            type="submit"
                            className="fp-btn"
                            disabled={isLoading}
                            aria-busy={isLoading}
                        >
                            {isLoading ? 'Sending...' : 'Send reset link'}
                        </button>
                        <Link to="/login" className="fp-link">
                            Back to Login
                        </Link>
                    </div>
                </form>

                <p className="fp-note">
                    We will send a secure link to reset your password. Check
                    spam/junk if you don't see it.
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;
