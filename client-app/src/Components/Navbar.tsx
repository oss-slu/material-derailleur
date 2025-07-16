import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../css/NavbarDropdown.css';

const Navbar: React.FC = () => {
    const [user, setUser] = useState<string>('');
    const location = useLocation();
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [userRole, setUserRole] = useState<string | null>(null);

    useEffect(() => {
        const checkLoginStatus = () => {
            const token = localStorage.getItem('token');
            const name = localStorage.getItem('name');

            if (token) {
                try {
                    const decoded = JSON.parse(atob(token.split('.')[1]));
                    setUserRole(decoded.role); // Save role from JWT
                } catch (err) {
                    console.error('Token decode failed:', err);
                }

                setIsLoggedIn(true);
                setUser(name || 'User'); // Default to 'User' if name is missing
            } else {
                setIsLoggedIn(false);
                setUser('');
                setUserRole(null);
            }
        };

        checkLoginStatus();

        // Listen for changes in localStorage (for logout updates)
        window.addEventListener('storage', checkLoginStatus);

        return () => {
            window.removeEventListener('storage', checkLoginStatus);
        };
    }, []);

    const handleLogout = (): void => {
        localStorage.removeItem('token');
        localStorage.removeItem('name');
        setIsLoggedIn(false);
        setUser('');

        // Ensure UI updates by reloading the page or using event dispatch
        window.dispatchEvent(new Event('storage'));
        window.location.href = '/';
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">
                    <img
                        src="/bworks.png"
                        alt="Logo"
                        style={{ width: '100px', height: '50px' }}
                    />
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div
                    className="collapse navbar-collapse"
                    id="navbarSupportedContent"
                >
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        {isLoggedIn ? (
                            <>
                                {userRole === 'DONOR' && (
                                    <>
                                        <li
                                            className="nav-item"
                                            style={{
                                                fontSize: '20px',
                                                paddingLeft: '10px',
                                            }}
                                        >
                                            <Link
                                                className="nav-link"
                                                to="/my-donations"
                                                style={{
                                                    fontWeight:
                                                        location.pathname ===
                                                        '/my-donations'
                                                            ? 'bold'
                                                            : 'normal',
                                                    color:
                                                        location.pathname ===
                                                        '/my-donations'
                                                            ? 'black'
                                                            : 'inherit',
                                                }}
                                            >
                                                Donations
                                            </Link>
                                        </li>
                                        <li
                                            className="nav-item"
                                            style={{
                                                fontSize: '20px',
                                                paddingLeft: '10px',
                                            }}
                                        >
                                            <Link
                                                className="nav-link"
                                                to="/donor-profile"
                                                style={{
                                                    fontWeight:
                                                        location.pathname ===
                                                        '/donor-profile'
                                                            ? 'bold'
                                                            : 'normal',
                                                    color:
                                                        location.pathname ===
                                                        '/donor-profile'
                                                            ? 'black'
                                                            : 'inherit',
                                                }}
                                            >
                                                My Profile
                                            </Link>
                                        </li>
                                    </>
                                )}

                                {userRole === 'ADMIN' && (
                                    <>
                                        <li
                                            className="nav-item dropdown"
                                            style={{
                                                fontSize: '20px',
                                                paddingLeft: '10px',
                                            }}
                                        >
                                            <span
                                                className="nav-link dropdown-toggle"
                                                id="navbarDropdown"
                                                style={{
                                                    fontWeight:
                                                        location.pathname ===
                                                            '/donations' ||
                                                        location.pathname ===
                                                            '/adddonation'
                                                            ? 'bold'
                                                            : 'normal',
                                                    color:
                                                        location.pathname ===
                                                            '/donations' ||
                                                        location.pathname ===
                                                            '/adddonation'
                                                            ? 'black'
                                                            : 'inherit',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                Donations
                                            </span>
                                            <ul
                                                className="dropdown-menu"
                                                aria-labelledby="navbarDropdown"
                                            >
                                                <li>
                                                    <Link
                                                        className="dropdown-item"
                                                        to="/donations"
                                                    >
                                                        All Donations
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link
                                                        className="dropdown-item"
                                                        to="/adddonation"
                                                    >
                                                        Add New Donation
                                                    </Link>
                                                </li>
                                            </ul>
                                        </li>

                                        <li
                                            className="nav-item dropdown"
                                            style={{
                                                fontSize: '20px',
                                                paddingLeft: '10px',
                                            }}
                                        >
                                            <span
                                                className="nav-link dropdown-toggle"
                                                id="navbarDropdown"
                                                style={{
                                                    fontWeight:
                                                        location.pathname.includes(
                                                            'program',
                                                        )
                                                            ? 'bold'
                                                            : 'normal',
                                                    color: location.pathname.includes(
                                                        'program',
                                                    )
                                                        ? 'black'
                                                        : 'inherit',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                Programs
                                            </span>
                                            <ul
                                                className="dropdown-menu"
                                                aria-labelledby="navbarDropdown"
                                            >
                                                <li>
                                                    <Link
                                                        className="dropdown-item"
                                                        to="/programs"
                                                    >
                                                        All Programs
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link
                                                        className="dropdown-item"
                                                        to="/addprogram"
                                                    >
                                                        Add New Program
                                                    </Link>
                                                </li>
                                            </ul>
                                        </li>

                                        <li
                                            className="nav-item dropdown"
                                            style={{
                                                fontSize: '20px',
                                                paddingLeft: '10px',
                                            }}
                                        >
                                            <span
                                                className="nav-link dropdown-toggle"
                                                id="navbarDropdown"
                                                style={{
                                                    fontWeight:
                                                        location.pathname.includes(
                                                            'donorform',
                                                        ) ||
                                                        location.pathname.includes(
                                                            'donorlist',
                                                        )
                                                            ? 'bold'
                                                            : 'normal',
                                                    color:
                                                        location.pathname.includes(
                                                            'donorform',
                                                        ) ||
                                                        location.pathname.includes(
                                                            'donorlist',
                                                        )
                                                            ? 'black'
                                                            : 'inherit',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                Donors
                                            </span>
                                            <ul
                                                className="dropdown-menu"
                                                aria-labelledby="navbarDropdown"
                                            >
                                                <li>
                                                    <Link
                                                        className="dropdown-item"
                                                        to="/donorlist"
                                                    >
                                                        All Donors
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link
                                                        className="dropdown-item"
                                                        to="/donorform"
                                                    >
                                                        Add New Donor
                                                    </Link>
                                                </li>
                                            </ul>
                                        </li>
                                    </>
                                )}

                                <li
                                    className="nav-item"
                                    style={{
                                        fontSize: '20px',
                                        paddingLeft: '10px',
                                    }}
                                >
                                    {/* Will need updating if the '/' path gets updated to not be the about page */}
                                    <Link
                                        className="nav-link"
                                        to="/about"
                                        style={{
                                            fontWeight:
                                                location.pathname ===
                                                    '/about' ||
                                                location.pathname === '/'
                                                    ? 'bold'
                                                    : 'normal',
                                            color:
                                                location.pathname ===
                                                    '/about' ||
                                                location.pathname === '/'
                                                    ? 'black'
                                                    : 'inherit',
                                        }}
                                    >
                                        About
                                    </Link>
                                </li>
                            </>
                        ) : (
                            <>
                                <li
                                    className="nav-item"
                                    style={{
                                        fontSize: '20px',
                                        paddingLeft: '10px',
                                    }}
                                >
                                    <Link
                                        className="nav-link active"
                                        to="/login"
                                        style={{
                                            fontWeight:
                                                location.pathname === '/login'
                                                    ? 'bold'
                                                    : 'normal',
                                            color:
                                                location.pathname === '/login'
                                                    ? 'black'
                                                    : 'inherit',
                                        }}
                                    >
                                        Login
                                    </Link>
                                </li>
                                <li
                                    className="nav-item"
                                    style={{
                                        fontSize: '20px',
                                        paddingLeft: '10px',
                                    }}
                                >
                                    <Link
                                        className="nav-link active"
                                        to="/register"
                                        style={{
                                            fontWeight:
                                                location.pathname ===
                                                '/register'
                                                    ? 'bold'
                                                    : 'normal',
                                            color:
                                                location.pathname ===
                                                '/register'
                                                    ? 'black'
                                                    : 'inherit',
                                        }}
                                    >
                                        Register
                                    </Link>
                                </li>
                                <li
                                    className="nav-item"
                                    style={{
                                        fontSize: '20px',
                                        paddingLeft: '10px',
                                    }}
                                >
                                    <Link
                                        className="nav-link"
                                        to="/about"
                                        style={{
                                            fontWeight:
                                                location.pathname === '/about'
                                                    ? 'bold'
                                                    : 'normal',
                                            color:
                                                location.pathname === '/about'
                                                    ? 'black'
                                                    : 'inherit',
                                        }}
                                    >
                                        About
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
                {isLoggedIn && (
                    <div>
                        <button onClick={handleLogout}>Logout</button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
