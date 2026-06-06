import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

const API_URL = 'https://script.google.com/macros/s/AKfycbyRMlQ9o9jssZNrr4zNueBh3EH_yCwpcC2k_Whc5fMiug8_4j37SmS8Hfo37wnMNmzL/exec';

if (typeof window !== 'undefined' && !window.storage) {
  let saveTimer = null;
  let lastSavedJSON = null;
  // FIX A+B: true mientras haya cambios locales no confirmados por el servidor
  let hasUncommittedChanges = false;
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
        console.log('[CRM] cargando desde Sheets...');
        const res = await fetch(API_URL);
        const data = await res.json();
        const json = JSON.stringify(fromSheets(data));
        lastSavedJSON = json;
        console.log('[CRM] datos cargados');
        return json;
      } catch (err) {
        console.error('[CRM] Error al cargar:', err);
        return null;
      }
    })();
    return initialLoadPromise;
  }

  // FIX B: fetch fresco sin cache, para el polling
  async function fetchFresh() {
    // El ?t= evita que el browser cachee la respuesta
    const res = await fetch(`${API_URL}?t=${Date.now()}`);
    const data = await res.json();
    return JSON.stringify(fromSheets(data));
  }

  fetchInitial();

  window.storage = {
    get: async (key) => {
      const value = await fetchInitial();
      if (!value) return null;
      return { key, value };
    },

    set: async (key, value) => {
      if (value === lastSavedJSON) {
        console.log('[CRM] skip save (sin cambios)');
        return { key, value };
      }

      hasUncommittedChanges = true; // FIX A: marcar ANTES de encolar
      clearTimeout(saveTimer);

      saveTimer = setTimeout(async () => {
        const toSave = value; // closure: captura el valor de este set()
        try {
          console.log('[CRM] guardando...');
          const res = await fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify(toSheets(JSON.parse(toSave))),
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          });
          console.log('[CRM] guardado OK, status:', res.status);
          lastSavedJSON = toSave;        // FIX A: solo actualizar DESPUÉS del éxito
          hasUncommittedChanges = false; // FIX A+B: liberar el lock de refresh
        } catch (err) {
          console.error('[CRM] Error guardando:', err);
          // hasUncommittedChanges queda en true → refresh() no va a pisar datos locales
          // lastSavedJSON no se actualiza → el próximo set() va a reintentar
        }
      }, 400) ; // FIX C: reducido de 800 ms (App.jsx ya tiene su propio debounce de 400 ms)

      return { key, value };
    },

    // FIX B: llamado desde el polling de App.jsx
    refresh: async () => {
      // Si hay cambios locales sin confirmar, no refrescar:
      // pisar datos locales con datos viejos del servidor sería peor
      if (hasUncommittedChanges) {
        console.log('[CRM] refresh skipped: hay cambios sin confirmar');
        return null;
      }
      try {
        const freshJSON = await fetchFresh();
        // Si el servidor tiene lo mismo que ya tenemos, no hay nada que hacer
        if (freshJSON === lastSavedJSON) return null;
        // Otro usuario guardó algo: actualizar referencia para que el save
        // effect de App.jsx no dispare un save redundante con los mismos datos
        lastSavedJSON = freshJSON;
        return { value: freshJSON };
      } catch (err) {
        console.error('[CRM] Error en refresh:', err);
        return null;
      }
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