import React from 'react';

const Contact: React.FC = () => {
    return (
        <div className="login-container">
            {/* Left side - Contact Info */}
            <div className="login-left">
                <h1
                    className="login-label"
                    style={{
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        color: '#222',
                    }}
                >
                    WE’D LOVE TO HEAR FROM YOU.
                </h1>
                <p
                    style={{
                        marginTop: '2rem',
                        fontSize: '1.1rem',
                        color: '#333',
                    }}
                >
                    Do you want to support our programs? Do you have an idea for
                    a new way for us to make even more dreams come true? We’d
                    love to hear from you.
                </p>
                <ul
                    style={{
                        fontSize: '1.1rem',
                        marginLeft: '1.5rem',
                        marginBottom: '1rem',
                        color: '#222',
                    }}
                >
                    <li>
                        Contact us at:{' '}
                        <a
                            href="mailto:info@bworks.org"
                            style={{
                                color: '#1c7ed6',
                                textDecoration: 'underline',
                            }}
                        >
                            info@bworks.org
                        </a>
                    </li>
                    <li>
                        Phone: <span>314-664-0828</span>
                    </li>
                </ul>
                <p
                    style={{
                        fontSize: '1.1rem',
                        fontStyle: 'italic',
                        color: '#333',
                    }}
                >
                    You can also stop by and see us in person on{' '}
                    <strong>Tuesday / Thursday or Saturday.</strong>
                </p>
            </div>
            {/* Right side - Overlapping Circles */}
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

export default Contact;
