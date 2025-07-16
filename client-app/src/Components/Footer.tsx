import React from 'react';

const Footer = () => {
    const footerStyle: React.CSSProperties = {
        backgroundColor: '#000000',
        backgroundImage:
            'repeating-linear-gradient(45deg, #111 0px, #111 2px, #000 2px, #000 4px)',
        color: '#cccccc',
        textAlign: 'center',
        padding: '1rem',
        fontFamily: 'Georgia, serif',
        fontSize: '0.95rem',
        borderTop: '1px solid #888',
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        zIndex: 1000,
    };

    const linkStyle: React.CSSProperties = {
        color: '#00BFFF',
        marginLeft: '8px',
        textDecoration: 'underline',
        cursor: 'pointer',
    };

    return (
        <footer style={footerStyle}>
            <div>
                © <strong>2025 St. Louis BWorks.</strong> 2414 Menard Street,
                St. Louis, MO 63104, (314) 664-0828
                <a
                    href="/contact"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={linkStyle}
                >
                    Contact Page
                </a>
            </div>
        </footer>
    );
};

export default Footer;
