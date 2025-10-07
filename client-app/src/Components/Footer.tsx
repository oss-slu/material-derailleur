import React from 'react';

const Footer = () => {
    const footerStyle: React.CSSProperties = {
        backgroundColor: '#ecf9fd',
        color: '#222',
        textAlign: 'center',
        padding: '2rem 0 1rem 0',
        fontFamily: 'Roboto, Arial, sans-serif',
        fontSize: '1rem',
        borderTop: '2px solid #4db8ff',
        width: '100%',
        marginTop: 'auto',
        boxShadow: '0 -2px 8px rgba(77,184,255,0.08)',
    };

    const linkStyle: React.CSSProperties = {
        color: '#1c7ed6',
        marginLeft: '8px',
        textDecoration: 'underline',
        cursor: 'pointer',
        fontWeight: 500,
    };

    return (
        <footer style={footerStyle}>
            <div>
                <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>© 2025 St. Louis BWorks</span> &nbsp;|&nbsp;
                2414 Menard Street, St. Louis, MO 63104 &nbsp;|&nbsp; (314) 664-0828
                <a
                    href="/contact"
                    style={linkStyle}
                >
                    Contact Page
                </a>
            </div>
        </footer>
    );
};

export default Footer;
