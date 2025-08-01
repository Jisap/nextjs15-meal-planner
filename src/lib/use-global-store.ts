import { createStore } from "@/lib/createStore";


type AlertConfig = {                                       // Define la "forma" (la interfaz) de la configuración de una alerta. 
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
};


type State = {                                             // Define la "forma" del estado que el store va a guardar.
  alertOpen: boolean;                                      // Un booleano que indica si la alerta está visible o no.
  alertConfig: AlertConfig | null;                         // Un objeto que guarda la configuración de la alerta actual.
};


type Actions = {                                           // Define las funciones (acciones) que pueden modificar el estado. 
  updateAlertOpen: (is: State["alertOpen"]) => void;
  showAlert: (config: AlertConfig) => void;
};


type Store = State & Actions;                              // `Store` es la unión de `State` y `Actions`, representando la estructura completa del store

// El propósito de `useGlobalStore` es gestionar el estado de un diálogo de alerta genérico.
// En lugar de que cada componente tenga su propia lógica para mostrar una alerta, este store centraliza todo.

// `createStore` es una función que crea nuestro store. Recibe dos argumentos:
// 1. Una "función creadora" que define el estado inicial y las acciones.
// 2. Un objeto de configuración opcional (en este caso, para la persistencia).
const useGlobalStore = createStore<Store>(
  // Argumento 1: La función creadora.
  // Recibe como parámetro la función `set`, que nos permite actualizar el estado de forma segura.
  (set) => ({
    // --- ESTADO INICIAL ---
    alertOpen: false, // Por defecto, la alerta está cerrada.
    alertConfig: null, // Y no hay ninguna configuración de alerta al inicio.

    // --- ACCIONES ---
    // `updateAlertOpen` es una acción para abrir o cerrar la alerta.
    updateAlertOpen: (is) =>
      set((state) => {
        state.alertOpen = is;
        // Si la alerta se cierra, también limpiamos su configuración.
        if (!is) state.alertConfig = null;
      }),

    // `showAlert` es una acción para mostrar la alerta con una configuración específica.
    showAlert: (config) =>
      set((state) => {
        state.alertOpen = true;
        state.alertConfig = config;
      }),
  }),
  // Argumento 2: Objeto de configuración para el store.
  {
    name: "global-store", // Nombre para la persistencia (ej. en localStorage).
    // `excludeFromPersist` evita que `alertOpen` se guarde, para que la alerta no reaparezca al recargar la página.
    excludeFromPersist: ["alertOpen"],
  }
);

// Esta es una función "helper" que nos permite mostrar una alerta desde cualquier parte
// de la aplicación sin necesidad de usar el hook `useGlobalStore` directamente.
const alert = (config: AlertConfig) => {
  useGlobalStore.getState().showAlert(config);
};

export { useGlobalStore, alert };