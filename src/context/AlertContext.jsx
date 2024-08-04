import React, { createContext, useState, useContext } from 'react';

const AlertContext = createContext();

export function useAlert() {
    return useContext(AlertContext);
}

export function AlertProvider({ children }) {
    const [alert, setAlert] = useState({ message: '', variant: '', show: false });

    function showAlert(message, variant) {
        setAlert({ message, variant, show: true });
    }

    function hideAlert() {
        setAlert({ message: '', variant: '', show: false });
    }

    return (
        <AlertContext.Provider value={{ alert, showAlert, hideAlert }}>
            {children}
        </AlertContext.Provider>
    );
}
