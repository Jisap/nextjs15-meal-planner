import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { StateCreator } from "zustand/vanilla";

type ConfigType<T> = {
  name?: string;
  storage?: Storage;
  skipPersist?: boolean;
  excludeFromPersist?: Array<keyof T>;
};

// Constructor de stores reutilizable

const createStore = <T extends object>(
  storeCreator: StateCreator<T, [["zustand/immer", never]], []>, // Función donde defines el estado inicial y las acciones
  config?: ConfigType<T>,                                        // Bbjeto de configuración opcional para personalizar el comportamiento del store
) => {
  const {
    name,
    storage,
    skipPersist = false,
    excludeFromPersist = [] as Array<keyof T>,
  } = config || {};

  // immer crea un store en segundo plano que es copia del storeCreator
  // Sus modificaciones son inmediatamente reflejadas en el storeCreator
  // y son mas fáciles de manejar ya que es como si estuvieramos modificando un objeto normal
  const immerStore = immer(storeCreator); 

  if (skipPersist) {                                              // Si skipPersist es true 
    return create<T>()(immerStore);                               // Se crea un store normal basado en la sintaxis de immer pero que no se guarda en localstorage
  }

  return create<T>()(                                             // Si skipPersist es false
    persist(immerStore, {                                         // Envolvemos el immerstore en otro middleware llamado persist
      name: name || "zustand-store",
      storage: createJSONStorage(() => storage || localStorage),
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(
            ([key]) => !excludeFromPersist.includes(key as keyof T),
          ),
        ),
    }),
  );
};

export { createStore };