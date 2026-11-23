import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
    return (
        <div className="login-container">
            {/* Left side - Text */}
            <div className="login-left">
                <h1
                    className="login-label"
                    style={{
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        color: '#222',
                    }}
                >
                    MATERIAL DERAILLEUR.
                </h1>
                <p
                    style={{
                        marginTop: '2rem',
                        fontSize: '1.1rem',
                        color: '#333',
                    }}
                >
                    This application is for maintaining the donor details,
                    tracking donations, and sending donors timely emails. This
                    encourages engagement with donors.
                </p>
                <div className="about-auth-actions">
                    <Link to="/login" className="login-submit">
                        Sign in
                    </Link>
                    <Link
                        to="/register"
                        className="login-submit about-register"
                    >
                        Register
                    </Link>
                </div>
            </div>
            {/* Right side - Overlapping Circles wrapper  */}
            <div className="login-right">
                <div className="circle-wrapper">
                    <div className="circle large">
                        <img
                            src={(process.env.PUBLIC_URL || '') + '/cycle.jpg'}
                            alt="BWorks bike"
                        />
                    </div>
                    <div className="circle small">
                        <img
                            src={(process.env.PUBLIC_URL || '') + '/image.jpg'}
                            alt="BWorks kids"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
