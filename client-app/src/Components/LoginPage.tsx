import React, { useState, ChangeEvent, FormEvent, useRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import AuthPageLayout from './AuthPageLayout';
import Popup from './LoginPopup';
import Captcha from './Captcha';
import type { CaptchaRef } from './Captcha';

interface Credentials {
    email: string;
    password: string;
}

const LoginPage: React.FC = () => {
    const [credentials, setCredentials] = useState<Credentials>({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [captcha, setCaptcha] = useState('');
    const [captchaValue, setCaptchaValue] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    const captchaRef = useRef<CaptchaRef>(null);

    const { usePopup } = Popup;
    const { triggerPopup } = usePopup();

    const onChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setCredentials(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setErrorMessage('');
    };

    const handleSubmit = async (
        e: FormEvent<HTMLFormElement>,
    ): Promise<void> => {
        e.preventDefault();
        setIsLoading(true);

        // Validate CAPTCHA (case-sensitive) due to overrride loginpage logic was changed
        if (captchaValue !== captcha) {
            setErrorMessage('Incorrect CAPTCHA. Please try again.');
            setIsLoading(false);
            captchaRef.current?.resetCaptcha();
            return;
        }

        try {
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_API_BASE_URL}api/login`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(credentials),
                },
            );

            const data = await response.json();
            if (response.ok) {
                //  Note: Using localStorage is less secure than HttpOnly cookies

                // Handle account status
                if (data.status === 'PENDING') {
                    setErrorMessage(
                        'Your account is pending approval. Please wait for an administrator to activate your account.',
                    );
                    captchaRef.current?.resetCaptcha();
                    return;
                } else if (data.status === 'SUSPENDED') {
                    setErrorMessage(
                        'Your account has been suspended. Please contact support for more information.',
                    );
                    captchaRef.current?.resetCaptcha();
                    return;
                }

                localStorage.setItem('token', data.token);

                // Persist user's display name and role for UI
                if (data.name) localStorage.setItem('name', data.name);
                if (data.role) localStorage.setItem('role', data.role);
                triggerPopup('Welcome ' + data.name + '!');

                if (
                    data.role === 'ADMIN' ||
                    data.role === 'TIER_ONE' ||
                    data.role === 'TIER_TWO' ||
                    data.role === 'TIER_THREE'
                ) {
                    window.location.href = (process.env.PUBLIC_URL || '') + '/';
                } else if (data.role === 'DONOR') {
                    window.location.href =
                        (process.env.PUBLIC_URL || '') + '/donor-profile';
                } else {
                    setErrorMessage(
                        'Unknown user role. Please contact support.',
                    );
                    captchaRef.current?.resetCaptcha();
                }
            } else {
                setErrorMessage(data.message || 'Invalid email or password.');
                captchaRef.current?.resetCaptcha();
            }
        } catch (error) {
            setErrorMessage('Something went wrong. Please try again.');
            captchaRef.current?.resetCaptcha();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthPageLayout
            eyebrow="Welcome back"
            title="Welcome to SLU BWORKS Platform"
            description="Sign in and make a difference."
        >
            <form
                onSubmit={handleSubmit}
                className="login-page-form"
                aria-busy={isLoading}
            >
                <div className="login-field">
                    <label htmlFor="email">Email address</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="you@example.com"
                        value={credentials.email}
                        onChange={onChange}
                        required
                    />
                </div>

                <div className="login-field">
                    <label htmlFor="password">Password</label>
                    <div className="login-password">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            name="password"
                            placeholder="Enter your password"
                            value={credentials.password}
                            onChange={onChange}
                            required
                        />
                        <button
                            type="button"
                            className="login-password-toggle"
                            aria-label={
                                showPassword ? 'Hide password' : 'Show password'
                            }
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? (
                                <EyeOff size={18} />
                            ) : (
                                <Eye size={18} />
                            )}
                        </button>
                    </div>
                </div>

                <Captcha
                    ref={captchaRef}
                    onCaptchaGenerated={setCaptcha}
                    onCaptchaChange={setCaptchaValue}
                />

                <Link to="/forgot-password">Forgot password?</Link>

                {errorMessage && (
                    <p className="login-error" role="alert">
                        {errorMessage}
                    </p>
                )}

                <button
                    className="login-submit"
                    type="submit"
                    disabled={!captchaValue || isLoading}
                    aria-label={isLoading ? 'Signing in' : undefined}
                >
                    {isLoading ? <LoadingSpinner /> : 'Sign in'}
                </button>

                <p className="login-register">
                    Need an account? <Link to="/register">Register Now</Link>
                </p>
            </form>
        </AuthPageLayout>
    );
};

export default LoginPage;
