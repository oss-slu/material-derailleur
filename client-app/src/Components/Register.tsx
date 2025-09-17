import React, { useState, ChangeEvent, FormEvent } from 'react';
import LoadingSpinner from './LoadingSpinner';
import '../css/RegisterPage.css';

interface Credentials {
    name: string;
    email: string;
    password: string;
    confirm_password: string;
}

/** Config */
const MIN_LEN = 8;

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
            upper: /[A-Z]/.test(password),
            lower: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[$&+,:;=?@#|'<>.^*()%!-]/.test(password),
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
        if (/[A-Z]/.test(password)) score += 1;
        if (/[a-z]/.test(password)) score += 1;
        if (/[0-9]/.test(password)) score += 1;
        if (/[$&+,:;=?@#|'<>.^*()%!-]/.test(password)) score += 1;

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
            // Show once user starts, hide automatically when valid
            setShowGuidelines(next.password.length > 0 && !isPasswordValid(r));
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
    const strengthColor = (s: typeof passwordStrength) =>
        s === 'weak'
            ? '#dc2626'
            : s === 'medium'
              ? '#d97706'
              : s === 'strong'
                ? '#16a34a'
                : '#6b7280';
    const strengthWidth = (s: typeof passwordStrength) =>
        s === 'weak'
            ? '33%'
            : s === 'medium'
              ? '66%'
              : s === 'strong'
                ? '100%'
                : '0%';

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-200">
            <div className="rlogin-container">
                <h2 className="rhead">Register</h2>
                <div className="rlogin-box">
                    <div className="bg-#a9d6e5">
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label className="rlabelu">Name</label>
                                <input
                                    type="text"
                                    className="ristyle"
                                    value={credentials.name}
                                    onChange={handleChange}
                                    id="name"
                                    name="name"
                                    aria-describedby="nameHelp"
                                    autoComplete="name"
                                />
                            </div>

                            <div>
                                <label className="rlabelu">Email address</label>
                                <input
                                    type="email"
                                    className="ristyle"
                                    value={credentials.email}
                                    onChange={handleChange}
                                    id="email"
                                    name="email"
                                    aria-describedby="emailHelp"
                                    autoComplete="email"
                                />
                            </div>

                            <div>
                                <label className="rlabelu">Password</label>
                                <input
                                    type="password"
                                    className="ristyle"
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
                                            computeStrength(
                                                credentials.password,
                                            ),
                                        );
                                        setShowGuidelines(
                                            credentials.password.length > 0 &&
                                                !isPasswordValid(r),
                                        );
                                    }}
                                    onBlur={() => {
                                        // hide if empty or already valid
                                        const r = computeRules(
                                            credentials.password,
                                            credentials.name,
                                            credentials.email,
                                        );
                                        if (
                                            !credentials.password ||
                                            isPasswordValid(r)
                                        )
                                            setShowGuidelines(false);
                                    }}
                                    name="password"
                                    id="password"
                                    autoComplete="new-password"
                                />

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
                                        <div style={{ fontWeight: 600 }}>
                                            Strength:
                                        </div>
                                        <div
                                            style={{
                                                color: strengthColor(
                                                    passwordStrength,
                                                ),
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
                                            width: strengthWidth(
                                                passwordStrength,
                                            ),
                                            height: '100%',
                                            background:
                                                strengthColor(passwordStrength),
                                            transition: 'width 160ms ease',
                                        }}
                                    />
                                </div>

                                {/* SHORT 3-point note: shows only while invalid */}
                                {showGuidelines && !isPasswordValid(rules) && (
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
                                            <strong>
                                                {MIN_LEN} characters
                                            </strong>
                                            .
                                        </li>
                                        <li>
                                            Include an{' '}
                                            <strong>uppercase</strong>,{' '}
                                            <strong>lowercase</strong>,{' '}
                                            <strong>number</strong>, and{' '}
                                            <strong>special character</strong>.
                                        </li>
                                        <li>
                                            Avoid using your{' '}
                                            <strong>name</strong> or{' '}
                                            <strong>email</strong>.
                                        </li>
                                    </ul>
                                )}
                            </div>

                            <div className="mb-3 position-relative">
                                <label
                                    htmlFor="confirm_password"
                                    className="rlabelu"
                                >
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    className="ristyle"
                                    value={credentials.confirm_password}
                                    onChange={handleChange}
                                    name="confirm_password"
                                    id="confirm_password"
                                    autoComplete="new-password"
                                />
                            </div>

                            {errorMessage && (
                                <div
                                    className="alert alert-danger"
                                    role="alert"
                                >
                                    {errorMessage}
                                </div>
                            )}
                            {successMessage && (
                                <div
                                    className="alert alert-success"
                                    role="alert"
                                >
                                    {successMessage}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="rbtSuccess"
                                disabled={isLoading}
                            >
                                Register
                            </button>
                            {isLoading && <LoadingSpinner />}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
