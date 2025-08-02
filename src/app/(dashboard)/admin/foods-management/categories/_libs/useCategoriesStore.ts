import { createStore } from "@/lib/createStore";


// El propósito principal de este store es mantener y actualizar datos relacionados con la interfaz de usuario
// de las categorías, de manera que múltiples componentes puedan acceder y modificar este estado de forma consistente 
// sin necesidad de pasar props de un componente a otro (evitando el "prop drilling").


// Forma de los datos que se almacenan en el store
type State = {                                                          
  selectedCategoryId: number | null;                                    // El ID de la categoría seleccionada, o null si no hay ninguna
  categoryDialogOpen: boolean;                                          // Un booleano para saber si el diálogo de categoría está abierto
};

// Funciones que pueden modificar el estado del store
type Actions = {
  updateSelectedCategoryId: (id: State["selectedCategoryId"]) => void;  // Función para actualizar el ID seleccionado
  updateCategoryDialogOpen: (is: State["categoryDialogOpen"]) => void;  // Función para abrir/cerrar el diálogo de categoría
};

type Store = State & Actions;                                           // Combina el estado y las acciones en un solo tipo para el store completo

const useCategoriesStore = createStore<Store>(                          // Función creadora del store define su estado inicial y las acciones
  (set) => ({
    // Estado inicial
    selectedCategoryId: null,
    categoryDialogOpen: false,
    // Funciones de acción
    updateSelectedCategoryId: (id) =>
      set((state) => {
        state.selectedCategoryId = id;
      }),
    updateCategoryDialogOpen: (is) =>
      set((state) => {
        state.categoryDialogOpen = is;
      }),
  }),
  {
    name: "categories-store", // Nombre del store para identificarlo en la devTools
  },
);

export { useCategoriesStore };