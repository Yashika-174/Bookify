import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { FireBaseProvider } from './context/FireBase.jsx';
import { BrowserRouter } from 'react-router-dom';
import { AlertProvider } from './context/AlertContext'; // Import AlertProvider

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <FireBaseProvider>
      <AlertProvider> {/* Wrap App with AlertProvider */}
        <App />
      </AlertProvider>
    </FireBaseProvider>
  </BrowserRouter>
);
