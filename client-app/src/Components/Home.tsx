import React from 'react';

// If this ever gets updated to not mimic the about page, please update the code in Navbar.tsx that bolds the about page when directed here

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
                    MATERIAL DONOR MUTUAL ASSIST.
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
            </div>
            {/* Right side - Overlapping Circles wrapper  */}
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

export default Home;
