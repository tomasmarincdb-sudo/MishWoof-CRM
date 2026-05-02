import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

const API_URL = 'https://script.google.com/macros/s/AKfycby19dweNf-YfJDUO7A60u1yHVK2hYWoFe810A1iueCXkyKZvGr2flrBZiamAp88MRhY/exec';

if (typeof window !== 'undefined' && !window.storage) {
  let saveTimer = null;
  let lastSavedJSON = null;
  let initialLoadPromise = null;

  function fromSheets(data) {
    return {
      contacts: data.contactos || [],
      stages: data.etapas || [],
      opportunities: data.oportunidades || [],
      tasks: data.tareas || [],
    };
  }
  function toSheets(crmData) {
    return {
      contactos: crmData.contacts || [],
      etapas: crmData.stages || [],
      oportunidades: crmData.opportunities || [],
      tareas: crmData.tasks || [],
    };
  }

  async function fetchInitial() {
    if (initialLoadPromise) return initialLoadPromise;
    initialLoadPromise = (async () => {
      try {
        console.log('[CRM] fetching inicial desde Sheets...');
        const res = await fetch(API_URL);
        const data = await res.json();
        const crmData = fromSheets(data);
        const json = JSON.stringify(crmData);
        lastSavedJSON = json;
        console.log('[CRM] datos iniciales cargados:', crmData);
        return json;
      } catch (err) {
        console.error('[CRM] Error leyendo:', err);
        return null;
      }
    })();
    return initialLoadPromise;
  }

  // Disparar carga inmediatamente
  fetchInitial();

  window.storage = {
    get: async (key) => {
      const value = await fetchInitial();
      if (!value) return null;
      return { key, value };
    },
    set: async (key, value) => {
      // No guardar si es igual a lo último que se guardó
      if (value === lastSavedJSON) {
        console.log('[CRM] skip save (sin cambios)');
        return { key, value };
      }
      lastSavedJSON = value;
      const crmData = JSON.parse(value);
      const sheetsData = toSheets(crmData);
      
      clearTimeout(saveTimer);
      saveTimer = setTimeout(async () => {
        try {
          console.log('[CRM] guardando:', sheetsData);
          const res = await fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify(sheetsData),
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          });
          console.log('[CRM] guardado, status:', res.status);
        } catch (err) {
          console.error('[CRM] Error guardando:', err);
        }
      }, 800);
      return { key, value };
    },
    delete: async (key) => ({ key, deleted: true }),
    list: async () => ({ keys: [] }),
  };
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)