import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { ErrorBoundary } from './components/ErrorBoundary';
import { assertEnterpriseRuntimeConfiguration } from './services/runtimeConfig';
import { logEvent } from './services/observabilityService';

assertEnterpriseRuntimeConfiguration();

logEvent({ level: 'info', message: 'Application bootstrap started' });

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
