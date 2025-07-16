import React from 'react';

const Contact = () => {
    const containerStyle: React.CSSProperties = {
        backgroundColor: '#000000',
        backgroundImage:
            'repeating-linear-gradient(45deg, #111 0px, #111 2px, #000 2px, #000 4px)',
        color: '#ffffff',
        padding: '3rem 1rem',
        fontFamily: 'Georgia, serif',
    };

    const headingStyle: React.CSSProperties = {
        color: '#00BFFF',
        fontSize: '2.5rem',
        fontWeight: 'bold',
        marginBottom: '1.5rem',
    };

    const paragraphStyle: React.CSSProperties = {
        fontSize: '1.2rem',
        maxWidth: '800px',
        marginBottom: '1.5rem',
    };

    const listStyle: React.CSSProperties = {
        fontSize: '1.2rem',
        marginLeft: '1.5rem',
        marginBottom: '1rem',
    };

    const italicTextStyle: React.CSSProperties = {
        fontSize: '1.2rem',
        fontStyle: 'italic',
    };

    return (
        <div style={containerStyle}>
            <h1 style={headingStyle}>WE’D LOVE TO HEAR FROM YOU.</h1>
            <p style={paragraphStyle}>
                Do you want to support our programs? Do you have an idea for a
                new way for us to make even more dreams come true? We’d love to
                hear from you.
            </p>
            <ul style={listStyle}>
                <li>
                    Contact us at:{' '}
                    <a
                        href="mailto:info@bworks.org"
                        style={{ color: '#00BFFF' }}
                    >
                        info@bworks.org
                    </a>
                </li>
                <li>
                    Phone: <span>314-664-0828</span>
                </li>
            </ul>
            <p style={italicTextStyle}>
                You can also stop by and see us in person on{' '}
                <strong>Tuesday / Thursday or Saturday.</strong>
            </p>
        </div>
    );
};

export default Contact;
