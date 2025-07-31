import { createStore } from "@/lib/createStore";

type AlertConfig = {                                     // Define la "forma" de la configuración de una alerta
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
};

type State = {                                           // Define los datos que el store va a guardar
  alertOpen: boolean;                                    // Un booleano que indica si la alerta está visible o no
  alertConfig: AlertConfig | null;                       // Un objeto que guarda la configuración de la alerta actual. 
};

type Actions = {                                         // Define las funciones que pueden modificar el estado.
  updateAlertOpen: (is: State["alertOpen"]) => void;
  showAlert: (config: AlertConfig) => void;
};

type Store = State & Actions;                             // Es la unión de State y Actions, representando la estructura completa del store.


// El propósito de useGlobalStore es gestionar el estado de un diálogo de alerta genérico. 
// En lugar de que cada componente tenga su propia lógica para mostrar una alerta, este store centraliza todo.

const useGlobalStore = createStore<Store>(                // Utilizamos createStore para crear un store con la sintaxis de immer
  (set) => ({                                             // El primer argumento es un setter que nos permite establecer el estado del store
    alertOpen: false,                                     // Por defecto la alerta está cerrada
    alertConfig: null,                                    // y no hay ninguna configuración de alerta al inicio 

    updateAlertOpen: (is) =>                              // 2º argumento es una función que actualiza el estado de alertOpen
      set((state) => {
        state.alertOpen = is;
        if (!is) state.alertConfig = null;
      }),

    showAlert: (config) =>                                // 3º argumento es una función que pone alertOpen en true y guarda la configuración que le paso alertConfig
      set((state) => {
        state.alertOpen = true;
        state.alertConfig = config;
      }),
  }),
  {
    name: "global-store",
    excludeFromPersist: ["alertOpen"],
  },
);

const alert = (config: AlertConfig) => {                   // Permite llamar a la función alert(config) sin importar el contexto
  useGlobalStore.getState().showAlert(config);
};

export { useGlobalStore, alert };