import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import '../css/RegisterPage.css';

interface Credentials {
    name: string;
    email: string;
    password: string;
    confirm_password: string;
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
    noName: MaybeBool; // null until we can evaluate
    noEmail: MaybeBool; // null until we can evaluate
};

/** Single REGEX source */
const REGEX = {
    upper: /[A-Z]/,
    lower: /[a-z]/,
    number: /[0-9]/,
    special: /[$&+,:;=?@#|'<>.^*()%!-]/,
};

const initialRules: RuleState = {
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false,
    noName: null,
    noEmail: null,
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
    const [rules, setRules] = useState<RuleState>(initialRules);
    const [showGuidelines, setShowGuidelines] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [successMessage, setSuccessMessage] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    // ---------- Rules / Strength ----------
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

    const isPasswordValid = (r: RuleState) =>
        r.length &&
        r.upper &&
        r.lower &&
        r.number &&
        r.special &&
        r.noName !== false &&
        r.noEmail !== false; // null counts as OK

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

        // keep rules + guidelines visibility in sync
        if (name === 'password' || name === 'name' || name === 'email') {
            const r = computeRules(next.password, next.name, next.email);
            setRules(r);
            // ⇩ Always show guidelines once there is any input
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
        setRules(r);

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
                setRules(initialRules);
                setShowGuidelines(false); // hide after success
                setTimeout(() => {
                    window.location.href = '/About';
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
        <div className="login-container">
            {/* Left side - Form */}
            <div className="login-left">
                <h2 className="login-label">Welcome to SLU BWORKS Platform</h2>

                {/* success/error */}
                {errorMessage && (
                    <div
                        style={{
                            background: '#fdecea',
                            color: '#b71c1c',
                            border: '1px solid #f5c6cb',
                            padding: '8px 10px',
                            borderRadius: 6,
                            marginBottom: 10,
                            maxWidth: 350,
                        }}
                    >
                        {errorMessage}
                    </div>
                )}
                {successMessage && (
                    <div
                        style={{
                            background: '#e8f5e9',
                            color: '#1b5e20',
                            border: '1px solid #c8e6c9',
                            padding: '8px 10px',
                            borderRadius: 6,
                            marginBottom: 10,
                            maxWidth: 350,
                        }}
                    >
                        {successMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="login-form">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        className="istyleu"
                        value={credentials.name}
                        onChange={handleChange}
                        id="name"
                        name="name"
                        aria-describedby="nameHelp"
                        autoComplete="name"
                        placeholder="Enter your name"
                    />

                    <label htmlFor="email">Email address</label>
                    <input
                        type="email"
                        className="istyleu"
                        value={credentials.email}
                        onChange={handleChange}
                        id="email"
                        name="email"
                        aria-describedby="emailHelp"
                        autoComplete="email"
                        placeholder="Enter your email"
                    />

                    <label htmlFor="password">Password</label>
                    <div style={{ position: 'relative' }}>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            className="istyle"
                            value={credentials.password}
                            onChange={handleChange}
                            onFocus={() => {
                                const r = computeRules(
                                    credentials.password,
                                    credentials.name,
                                    credentials.email,
                                );
                                setRules(r);
                                setPasswordStrength(
                                    computeStrength(credentials.password),
                                );
                                setShowGuidelines(true);
                            }}
                            onBlur={() => {
                                if (!credentials.password) {
                                    setShowGuidelines(false);
                                }
                            }}
                            name="password"
                            id="password"
                            autoComplete="new-password"
                            placeholder="Create a strong password"
                        />
                        <button
                            type="button"
                            aria-label={
                                showPassword ? 'Hide password' : 'Show password'
                            }
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                position: 'absolute',
                                right: 10,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                            }}
                        >
                            {showPassword ? (
                                <EyeOff size={18} />
                            ) : (
                                <Eye size={18} />
                            )}
                        </button>
                    </div>

                    {/* Strength label */}
                    {passwordStrength && (
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                marginTop: 8,
                            }}
                        >
                            <div style={{ fontWeight: 600 }}>Strength:</div>
                            <div
                                style={{
                                    color: strengthColor(passwordStrength),
                                    fontWeight: 700,
                                }}
                            >
                                {passwordStrength.toUpperCase()}
                            </div>
                        </div>
                    )}

                    {/* Slim progress bar */}
                    <div
                        aria-hidden="true"
                        style={{
                            marginTop: 6,
                            height: 6,
                            background: '#e5e7eb',
                            borderRadius: 9999,
                            overflow: 'hidden',
                        }}
                    >
                        <div
                            style={{
                                width: strengthWidth(passwordStrength),
                                height: '100%',
                                background: strengthColor(passwordStrength),
                                transition: 'width 160ms ease',
                            }}
                        />
                    </div>

                    {/* SHORT 3-point note: always visible once there is any input */}
                    {showGuidelines && (
                        <ul
                            className="password-note"
                            style={{
                                marginTop: 10,
                                background: '#eef6ff',
                                border: '1px solid #bfdbfe',
                                borderRadius: 8,
                                padding: '10px 12px',
                                fontSize: '0.9rem',
                                listStyle: 'disc',
                                paddingLeft: 22,
                            }}
                        >
                            <li>
                                Use at least{' '}
                                <strong>{MIN_LEN} characters</strong>.
                            </li>
                            <li>
                                Include an <strong>uppercase</strong>,{' '}
                                <strong>lowercase</strong>,{' '}
                                <strong>number</strong>, and{' '}
                                <strong>special character</strong>.
                            </li>
                            <li>
                                Avoid using your <strong>name</strong> or{' '}
                                <strong>email</strong>.
                            </li>
                        </ul>
                    )}

                    <label htmlFor="confirm_password">Confirm Password</label>
                    <div style={{ position: 'relative' }}>
                        <input
                            type={showConfirm ? 'text' : 'password'}
                            className="istyle"
                            value={credentials.confirm_password}
                            onChange={handleChange}
                            name="confirm_password"
                            id="confirm_password"
                            autoComplete="new-password"
                            placeholder="Re-enter your password"
                        />
                        <button
                            type="button"
                            aria-label={
                                showConfirm ? 'Hide password' : 'Show password'
                            }
                            onClick={() => setShowConfirm(!showConfirm)}
                            style={{
                                position: 'absolute',
                                right: 10,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                            }}
                        >
                            {showConfirm ? (
                                <EyeOff size={18} />
                            ) : (
                                <Eye size={18} />
                            )}
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="btlSuccess"
                        disabled={isLoading}
                    >
                        {isLoading ? <LoadingSpinner /> : 'Register'}
                    </button>

                    <div className="register-link">
                        <p>
                            Already have an account?{' '}
                            <Link to="/login">Login</Link>
                        </p>
                    </div>
                </form>
            </div>

            {/* Right side - Overlapping Circles (same pattern as Login) */}
            <div className="login-right">
                <div className="circle large">
                    <img src="/cycle.jpg" alt="BWorks bike" />
                </div>
                <div className="circle small">
                    <img src="/image.jpg" alt="BWorks kids" />
                </div>
            </div>
        </div>
    );
};

export default Register;
