import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// Puente temporal: emula window.storage usando localStorage del navegador.
// Más adelante reemplazamos esto por llamadas al Apps Script de Google Sheets.
if (typeof window !== 'undefined' && !window.storage) {
  window.storage = {
    get: async (key) => {
      const value = localStorage.getItem(key);
      return value !== null ? { key, value } : null;
    },
    set: async (key, value) => {
      localStorage.setItem(key, value);
      return { key, value };
    },
    delete: async (key) => {
      localStorage.removeItem(key);
      return { key, deleted: true };
    },
    list: async () => {
      const keys = Object.keys(localStorage);
      return { keys };
    },
  };
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)