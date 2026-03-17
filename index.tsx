
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Polyfill process for libraries that expect it
if (typeof window !== 'undefined' && !window.process) {
  (window as any).process = { env: {} };
}

// Global error handler for catching unhandled promise rejections or errors
window.onerror = (message, source, lineno, colno, error) => {
  console.error('Global Error:', { message, source, lineno, colno, error });
  const root = document.getElementById('root');
  if (root && root.innerHTML === '') {
    root.innerHTML = `<div style="padding: 20px; color: white; background: #1e293b; height: 100vh; font-family: sans-serif;">
      <h1 style="color: #ef4444;">Application Error</h1>
      <p>Something went wrong while loading the application.</p>
      <pre style="background: #0f172a; padding: 10px; border-radius: 8px; overflow: auto;">${message}</pre>
      <button onclick="window.location.reload()" style="background: #10b981; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;">Reload Page</button>
    </div>`;
  }
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
