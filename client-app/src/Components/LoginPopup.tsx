import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * Type definition for the PopupContext.
 * @interface PopupContextType
 * @property {boolean} showPopup - Whether the popup is visible.
 * @property {string} message - The message to display in the popup.
 * @property {Function} triggerPopup - Function to trigger the popup with a custom message.
 */

interface PopupContextType {
    showPopup: boolean;
    message: string;
    triggerPopup: (message: string) => void;
}

const PopupContext = createContext<PopupContextType | undefined>(undefined);

/**
 * PopupProvider component to manage the popup context.
 * @component
 * @description This component wraps its children with the PopupContext,
 * allowing other components to access and trigger the popup.
 * @param {React.ReactNode} children - The components that are wrapped by the provider.
 */
const PopupProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [showPopup, setShowPopup] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');

    useEffect(() => {
        const storedMessage = localStorage.getItem('popupMessage');
        if (storedMessage) {
            setMessage(storedMessage);
            setShowPopup(true);

            // Auto-hide after 5 seconds
            setTimeout(() => {
                setShowPopup(false);
                localStorage.removeItem('popupMessage');
            }, 5000);
        }
    }, []);

    const triggerPopup = (msg: string) => {
        setMessage(msg);
        setShowPopup(true);
        localStorage.setItem('popupMessage', msg);
    };

    return (
        <PopupContext.Provider value={{ showPopup, message, triggerPopup }}>
            {children}
            {showPopup && <div className="popup">{message}</div>}
        </PopupContext.Provider>
    );
};

// Hook for using the popup in any component
const usePopup = (): PopupContextType => {
    const context = useContext(PopupContext);
    if (!context) {
        throw new Error('usePopup must be used within a PopupProvider');
    }
    return context;
};

export default { PopupProvider, usePopup };
