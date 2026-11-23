import React, { useState, ChangeEvent, FormEvent, useRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import Captcha from './Captcha';
import AuthPageLayout from './AuthPageLayout';
import '../css/RegisterPage.css';

interface Credentials {
    name: string;
    email: string;
    password: string;
    confirm_password: string;
}
interface CaptchaHandle {
    resetCaptcha: () => void;
}

/** Config */
const MIN_LEN = 12;

type MaybeBool = boolean | null;

type RuleState = {
    length: boolean;
    upper: boolean;
    lower: boolean;
    number: boolean;
    special: boolean;
    noName: MaybeBool;
    noEmail: MaybeBool;
};

/** Single REGEX source */
const REGEX = {
    upper: /[A-Z]/,
    lower: /[a-z]/,
    number: /[0-9]/,
    special: /[$&+,:;=?@#|'<>.^*()%!-]/,
};

const Register: React.FC = () => {
    const [credentials, setCredentials] = useState<Credentials>({
        name: '',
        email: '',
        password: '',
        confirm_password: '',
    });

    const [passwordStrength, setPasswordStrength] = useState<
        'weak' | 'medium' | 'strong' | null
    >(null);
    const [showGuidelines, setShowGuidelines] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [successMessage, setSuccessMessage] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [captcha, setCaptcha] = useState('');
    const [captchaValue, setCaptchaValue] = useState<string>('');

    const captchaRef = useRef<CaptchaHandle>(null);

    const computeRules = (
        password: string,
        name: string,
        email: string,
    ): RuleState => {
        if (!password) {
            return {
                length: false,
                upper: false,
                lower: false,
                number: false,
                special: false,
                noName: null,
                noEmail: null,
            };
        }

        const nameToken = name.trim().replace(/\s+/g, '');
        const emailLocal = (email.split('@')[0] || '').trim();

        const hasNameToken = nameToken.length >= 3;
        const hasEmailToken = emailLocal.length >= 3;

        const containsName =
            hasNameToken &&
            password.toLowerCase().includes(nameToken.toLowerCase());
        const containsEmail =
            hasEmailToken &&
            password.toLowerCase().includes(emailLocal.toLowerCase());

        return {
            length: password.length >= MIN_LEN,
            upper: REGEX.upper.test(password),
            lower: REGEX.lower.test(password),
            number: REGEX.number.test(password),
            special: REGEX.special.test(password),
            noName: hasNameToken ? !containsName : null,
            noEmail: hasEmailToken ? !containsEmail : null,
        };
    };

    const computeStrength = (
        password: string,
    ): 'weak' | 'medium' | 'strong' | null => {
        if (!password) return null;
        let score = 0;
        if (password.length >= MIN_LEN) score += 1;
        if (password.length >= MIN_LEN + 3) score += 1;
        if (REGEX.upper.test(password)) score += 1;
        if (REGEX.lower.test(password)) score += 1;
        if (REGEX.number.test(password)) score += 1;
        if (REGEX.special.test(password)) score += 1;

        if (score <= 2) return 'weak';
        if (score <= 4) return 'medium';
        return 'strong';
    };

    // ---------- Form handlers ----------
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const next = { ...credentials, [name]: value } as Credentials;
        setCredentials(next);
        setErrorMessage('');

        if (name === 'password') {
            setPasswordStrength(computeStrength(value));
            const err = validatePassword(value, next.name, next.email);
            setErrorMessage(err);
        }

        if (name === 'confirm_password') {
            setErrorMessage(
                value !== credentials.password ? 'Passwords do not match' : '',
            );
        }

        if (name === 'password' || name === 'name' || name === 'email') {
            computeRules(next.password, next.name, next.email);
            setShowGuidelines(next.password.length > 0);
        }
    };

    const validatePassword = (
        password: string,
        name?: string,
        email?: string,
    ): string => {
        const nm = name ?? credentials.name;
        const em = email ?? credentials.email;
        const r = computeRules(password, nm, em);

        if (!r.length) return `Password must be at least ${MIN_LEN} characters`;

        if (!r.upper || !r.lower || !r.number || !r.special) {
            const missing: string[] = [];
            if (!r.upper) missing.push('an uppercase letter');
            if (!r.lower) missing.push('a lowercase letter');
            if (!r.number) missing.push('a number');
            if (!r.special) missing.push('a special character');
            if (missing.length === 1)
                return 'Password must contain ' + missing[0] + '!';
            const last = missing.pop();
            return (
                'Password must contain ' +
                missing.join(', ') +
                ' and ' +
                last +
                '!'
            );
        }

        if (r.noName === false) return 'Password must not contain name';
        if (r.noEmail === false) return 'Password must not contain email';

        return '';
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        if (!credentials.name.trim()) {
            setErrorMessage('Name is required');
            setIsLoading(false);
            return;
        }

        if (!credentials.email.trim()) {
            setErrorMessage('Email is required');
            setIsLoading(false);
            return;
        }

        if (!credentials.password) {
            setErrorMessage('Password is required');
            setIsLoading(false);
            return;
        }

        if (!credentials.confirm_password) {
            setErrorMessage('Please confirm your password');
            setIsLoading(false);
            return;
        }

        if (captchaValue !== captcha) {
            setErrorMessage('Incorrect CAPTCHA. Please try again.');
            setIsLoading(false);
            captchaRef.current?.resetCaptcha();
            return;
        }

        if (credentials.password !== credentials.confirm_password) {
            setErrorMessage('Passwords do not match');
            setIsLoading(false);
            return;
        }

        const validationError = validatePassword(credentials.password);
        if (validationError) {
            setErrorMessage(validationError);
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_API_BASE_URL}api/register`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: credentials.name,
                        email: credentials.email,
                        password: credentials.password,
                    }),
                },
            );

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage(data.message);
                setErrorMessage('');
                setCredentials({
                    name: '',
                    email: '',
                    password: '',
                    confirm_password: '',
                });
                setPasswordStrength(null);
                setShowGuidelines(false);
                setTimeout(() => {
                    window.location.href =
                        (process.env.PUBLIC_URL || '') + '/About';
                }, 2000);
            } else {
                setErrorMessage(data.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // ---------- UI helpers ----------
    const strengthColor = (s: typeof passwordStrength) => {
        switch (s) {
            case 'weak':
                return '#dc2626';
            case 'medium':
                return '#d97706';
            case 'strong':
                return '#16a34a';
            default:
                return '#6b7280';
        }
    };

    const strengthWidth = (s: typeof passwordStrength) => {
        switch (s) {
            case 'weak':
                return '33%';
            case 'medium':
                return '66%';
            case 'strong':
                return '100%';
            default:
                return '0%';
        }
    };

    return (
        <AuthPageLayout
            eyebrow="Welcome"
            title={
                <>
                    Create Your
                    <br />
                    BWORKS account
                </>
            }
            description="Register to get started with the SLU BWORKS Platform."
        >
            <form
                onSubmit={handleSubmit}
                className="login-page-form"
                aria-busy={isLoading}
            >
                <div className="register-fields">
                    <div className="login-field">
                        <label htmlFor="name">Name</label>
                        <input
                            id="name"
                            name="name"
                            autoComplete="name"
                            placeholder="Enter your name"
                            value={credentials.name}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="login-field">
                        <label htmlFor="email">Email address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            autoComplete="email"
                            placeholder="you@example.com"
                            value={credentials.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="login-field">
                        <label htmlFor="password">Password</label>
                        <div className="login-password">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                autoComplete="new-password"
                                placeholder="Create a password"
                                value={credentials.password}
                                onChange={handleChange}
                                onFocus={() => {
                                    computeRules(
                                        credentials.password,
                                        credentials.name,
                                        credentials.email,
                                    );
                                    setPasswordStrength(
                                        computeStrength(credentials.password),
                                    );
                                    setShowGuidelines(true);
                                }}
                                onBlur={() => {
                                    if (!credentials.password)
                                        setShowGuidelines(false);
                                }}
                                aria-describedby={
                                    showGuidelines
                                        ? 'password-requirements'
                                        : undefined
                                }
                            />
                            <button
                                type="button"
                                className="login-password-toggle"
                                aria-label={
                                    showPassword
                                        ? 'Hide password'
                                        : 'Show password'
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
                    <div className="login-field">
                        <label htmlFor="confirm_password">
                            Confirm password
                        </label>
                        <div className="login-password">
                            <input
                                type={showConfirm ? 'text' : 'password'}
                                id="confirm_password"
                                name="confirm_password"
                                autoComplete="new-password"
                                placeholder="Re-enter password"
                                value={credentials.confirm_password}
                                onChange={handleChange}
                            />
                            <button
                                type="button"
                                className="login-password-toggle"
                                aria-label={
                                    showConfirm
                                        ? 'Hide confirmed password'
                                        : 'Show confirmed password'
                                }
                                onClick={() => setShowConfirm(!showConfirm)}
                            >
                                {showConfirm ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {showGuidelines && (
                    <div
                        className="register-password-help"
                        id="password-requirements"
                    >
                        {passwordStrength && (
                            <>
                                <p>
                                    Strength:{' '}
                                    <strong>{passwordStrength}</strong>
                                </p>
                                <div
                                    className="strength-bar"
                                    aria-hidden="true"
                                >
                                    <div
                                        className="strength-fill"
                                        style={{
                                            width: strengthWidth(
                                                passwordStrength,
                                            ),
                                            background:
                                                strengthColor(passwordStrength),
                                        }}
                                    />
                                </div>
                            </>
                        )}
                        <p>
                            Use at least {MIN_LEN} characters with uppercase and
                            lowercase letters, a number, and a special
                            character. Avoid using your name or email.
                        </p>
                    </div>
                )}

                <Captcha
                    ref={captchaRef}
                    onCaptchaGenerated={setCaptcha}
                    onCaptchaChange={setCaptchaValue}
                />

                {errorMessage && (
                    <p className="login-error" role="alert">
                        {errorMessage}
                    </p>
                )}
                {successMessage && (
                    <p className="register-success" role="status">
                        {successMessage}
                    </p>
                )}

                <button
                    type="submit"
                    className="login-submit"
                    disabled={!captchaValue || isLoading}
                    aria-label={isLoading ? 'Registering' : undefined}
                >
                    {isLoading ? <LoadingSpinner /> : 'Register'}
                </button>

                <p className="login-register">
                    Already have an account? <Link to="/login">Sign in</Link>
                </p>
            </form>
        </AuthPageLayout>
    );
};

export default Register;
