import React from 'react';
import '../css/LoadingSpinner.css'; // Optional if you want to style separately

const LoadingSpinner: React.FC = () => {
    return (
        <div className="spinner-container">
            <div className="loading-spinner"></div>
        </div>
    );
};

export default LoadingSpinner;
