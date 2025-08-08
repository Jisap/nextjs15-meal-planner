import {
  mealFiltersDefaultValues,
  MealFiltersSchema,
} from "@/app/(dashboard)/client/_types/mealFilterSchema";
import { createStore } from "@/lib/createStore";

// --- 1. Definición de la "forma" del estado ---
// Aquí se definen los tipos de datos que el store va a manejar.
type State = {
  // Almacena el ID de la comida seleccionada para editar.
  // Es `null` si el usuario está creando una nueva comida.
  selectedMealId: number | null;

  // Controla la visibilidad del diálogo (modal) para crear/editar una comida.
  mealDialogOpen: boolean;

  // Guarda el objeto de filtros actual. En este caso, contiene la fecha
  // por la que se están filtrando las comidas.
  mealFilters: MealFiltersSchema;
};

// --- 2. Definición de las "acciones" ---
// Son las funciones que los componentes usarán para modificar el estado.
type Actions = {
  updateSelectedMealId: (id: State["selectedMealId"]) => void;                // Función para actualizar el ID de la comida seleccionada.
  updateMealDialogOpen: (is: State["mealDialogOpen"]) => void;                // Función para abrir o cerrar el diálogo de la comida.
  updateMealFilters: (filters: State["mealFilters"]) => void;                 // Función para actualizar los filtros de las comidas.
};

// --- 3. Combinación de Estado y Acciones ---
// Se crea un tipo `Store` que une el estado y las acciones.
type Store = State & Actions;

// --- 4. Creación del Store con `createStore` (basado en Zustand) ---
const useMealsStore = createStore<Store>(
  // La función `set` es proporcionada por Zustand para actualizar el estado.
  // El middleware `immer` permite "mutar" el estado directamente de forma segura.
  (set) => ({
    // --- Estado Inicial ---
    selectedMealId: null,
    mealDialogOpen: false,
    mealFilters: mealFiltersDefaultValues, // Se inicializa con los valores por defecto del esquema de filtros.

    // --- Implementación de las Acciones ---
    updateSelectedMealId: (id) =>
      set((state) => {
        // Actualiza el ID de la comida seleccionada en el estado.
        state.selectedMealId = id;
      }),

    updateMealDialogOpen: (is) =>
      set((state) => {
        // Actualiza el estado de visibilidad del diálogo.
        state.mealDialogOpen = is;
      }),

    updateMealFilters: (filters) =>
      set((state) => {
        // Reemplaza el objeto de filtros con el nuevo que se ha pasado.
        state.mealFilters = filters;
      }),
  }),
  {
    // Configuración adicional para el store.
    // `name` es útil para la depuración y la persistencia en localStorage.
    name: "meals-store",
  },
);

export { useMealsStore };
