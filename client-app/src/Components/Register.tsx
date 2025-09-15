import React, { useState, ChangeEvent, FormEvent } from 'react';
import LoadingSpinner from './LoadingSpinner';
import '../css/RegisterPage.css';

interface Credentials {
name: string;
email: string;
password: string;
confirm_password: string;
}

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
const [successMessage, setSuccessMessage] = useState<string>('');
const [errorMessage, setErrorMessage] = useState<string>('');
const [isLoading, setIsLoading] = useState(false);

const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });

    if (name === 'password') {
        if (value.length === 0) {
            setPasswordStrength(null);
        } else if (value.length < 12) {
            setPasswordStrength('weak');
        } else if (value.length >= 12 && value.length <= 15) {
            setPasswordStrength('medium');
        } else {
            setPasswordStrength('strong');
        }

        validatePassword(value);
    }
};

const validatePassword = (password: string) => {
    if (password.length < 12) {
        setErrorMessage('Password must be at least 12 characters');
        return;
    }

    if (password.match(credentials.name)) {
        setErrorMessage('Password must not contain name');
        return;
    }

    if (password.match(credentials.email)) {
        setErrorMessage('Password must not contain email');
        return;
    }

    const missing: string[] = [];

    if (!password.match(/[A-Z]/)) missing.push('an uppercase');
    if (!password.match(/[a-z]/)) missing.push('a lowercase');
    if (!password.match(/[0-9]/)) missing.push('a number');
    if (!password.match(/[$&+,:;=?@#|'<>.^*()%!-]/))
        missing.push('a special character');

    if (missing.length !== 0) {
        if (missing.length === 1) {
            setErrorMessage('Password must contain ' + missing[0] + '!');
        } else {
            const tmp = missing.pop();
            setErrorMessage(
                'Password must contain ' +
                    missing.join(', ') +
                    ' and ' +
                    tmp +
                    '!',
            );
        }
        return;
    } else {
        setErrorMessage('');
    }
};

const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (credentials.password !== credentials.confirm_password) {
        setErrorMessage('Passwords do not match');
        setIsLoading(false);
        return;
    }

    validatePassword(credentials.password);
    if (errorMessage) {
        setIsLoading(false);
        return;
    }

    try {
        const response = await fetch(
            `${process.env.REACT_APP_BACKEND_API_BASE_URL}api/register`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
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

// Map strength to colors
const getStrengthColor = (strength: 'weak' | 'medium' | 'strong' | null) => {
    switch (strength) {
        case 'weak':
            return 'red';
        case 'medium':
            return 'orange';
        case 'strong':
            return 'green';
        default:
            return 'black';
    }
};

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
                            />
                        </div>
                        <div>
                            <label className="rlabelu">Password</label>
                            <input
                                type="password"
                                className="ristyle"
                                value={credentials.password}
                                onChange={handleChange}
                                name="password"
                                id="password"
                            />
                            {passwordStrength && (
                                <div
                                    className="password-strength-meter"
                                    style={{ display: 'flex' }}
                                >
                                    <p className="my-3">
                                        Password Strength:
                                    </p>
                                    <p
                                        className="my-3 mx-2"
                                        style={{
                                            marginTop: '5px',
                                            textAlign: 'center',
                                            fontWeight: 'bold',
                                            color: getStrengthColor(
                                                passwordStrength,
                                            ),
                                        }}
                                    >
                                        {passwordStrength.toUpperCase()}
                                    </p>
                                </div>
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
