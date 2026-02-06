import React, {
    useState,
    ChangeEvent,
    FormEvent,
    useEffect,
    useRef,
} from 'react';
import { RefreshCw, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import '../css/LoginPage.css';
import Popup from './LoginPopup';

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
    const [captcha, setCaptcha] = useState<string>('');
    const [captchaValue, setCaptchaValue] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const captchaCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const { usePopup } = Popup;
    const { triggerPopup } = usePopup();

    useEffect(() => {
        generateCaptcha();
    }, []);

    // Generate random captcha and draw on canvas (original logic kept)
    const generateCaptcha = (): void => {
        const randomCaptcha = Math.random().toString(36).substring(7);
        setCaptcha(randomCaptcha);
        drawCaptcha(randomCaptcha);
    };

    const resetCaptcha = (): void => {
        generateCaptcha();
        setCaptchaValue('');
    };

    const drawCaptcha = (text: string): void => {
        if (captchaCanvasRef.current) {
            const canvas = captchaCanvasRef.current;
            const ctx = canvas.getContext('2d');

            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.font = '20px Arial';
                ctx.fillStyle = 'black';
                ctx.fillText(text, 10, 22);
            }
        }
    };

    const onChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setCredentials(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setErrorMessage('');
    };

    const handleCaptchaChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setCaptchaValue(e.target.value);
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
            resetCaptcha();
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
                localStorage.setItem('token', data.token);
                
                // Persist user's display name and role for UI
                if (data.name) localStorage.setItem('name', data.name);
                if (data.role) localStorage.setItem('role', data.role);
                triggerPopup('Welcome ' + data.name + '!');

                if (data.role === 'ADMIN') {
                    window.location.href = '/';
                } else if (data.role === 'DONOR') {
                    window.location.href = '/donor-profile';
                } else {
                    setErrorMessage(
                        'Unknown user role. Please contact support.',
                    );
                    resetCaptcha();
                }
            } else {
                setErrorMessage(data.message || 'Invalid email or password.');
                resetCaptcha();
            }
        } catch (error) {
            setErrorMessage('Something went wrong. Please try again.');
            resetCaptcha();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            {/* Left side - Form */}
            <div className="login-left">
                <h2 className="login-label">Welcome to SLU BWORKS Platform</h2>

                {errorMessage && (
                    <div className="error-message">{errorMessage}</div>
                )}

                <form onSubmit={handleSubmit} className="login-form">
                    <label htmlFor="email">Username/Email</label>
                    <input
                        type="email"
                        className="istyleu"
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                        value={credentials.email}
                        onChange={onChange}
                        required
                    />

                    <label htmlFor="password">Password</label>
                    <div className="password-wrapper">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            className="istyle"
                            id="password"
                            name="password"
                            placeholder="Enter your password"
                            value={credentials.password}
                            onChange={onChange}
                            required
                        />
                        <button
                            type="button"
                            className="toggle-password"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? (
                                <EyeOff size={18} />
                            ) : (
                                <Eye size={18} />
                            )}
                        </button>
                    </div>

                    {/* Captcha */}
                    <div className="captcha-container">
                        <div className="captcha-row">
                            <canvas
                                ref={captchaCanvasRef}
                                width="100"
                                height="30"
                            ></canvas>
                            <RefreshCw
                                className="refresh-icon"
                                size={20}
                                onClick={resetCaptcha}
                                aria-label="Refresh CAPTCHA"
                            />
                        </div>
                        <input
                            type="text"
                            className="captcha-input"
                            value={captchaValue}
                            onChange={handleCaptchaChange}
                            placeholder="Enter CAPTCHA"
                            id="captcha"
                            name="captcha"
                            required
                        />
                    </div>

                    <div className="buttongroups">
                        <button
                            className="btlSuccess"
                            type="submit"
                            disabled={!captchaValue || isLoading}
                        >
                            {isLoading ? <LoadingSpinner /> : 'Login'}
                        </button>
                        <Link to="/forgot-password" className="btn btn-link">
                            Forgot Password?
                        </Link>
                    </div>
                </form>

                <div className="register-link">
                    <p>
                        New to BWorks? <Link to="/register"> Register</Link>
                    </p>
                </div>
            </div>

            {/* Right side - Overlapping Circles */}
            <div className="login-right">
                <div className="circle-wrapper">
                    <div className="circle large">
                        <img src="/cycle.jpg" alt="BWorks bike" />
                    </div>
                    <div className="circle small">
                        <img src="/image.jpg" alt="BWorks kids" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
