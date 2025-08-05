import {
  foodFiltersDefaultValues,
  FoodFiltersSchema,
  foodFiltersSchema,
} from "@/app/(dashboard)/admin/foods-management/foods/_types/foodFilterSchema";
import { createStore } from "@/lib/createStore";

type State = {
  selectedFoodId: number | null;      // Guarda el ID del alimento seleccionado para editar. Es `null` si se está creando uno nuevo.
  foodDialogOpen: boolean;            // Controla si el diálogo (modal) para crear/editar alimentos está abierto o cerrado.
  foodFilters: FoodFiltersSchema;     // Almacena el objeto completo con todos los filtros de búsqueda (término, rangos, paginación, etc.). Los datos aquí ya estan validados por zod. 
  foodFiltersDrawerOpen: boolean;     // Controla si el panel o "cajón" de filtros está visible.
};


type Actions = {
  updateSelectedFoodId: (id: number | null) => void;        // Actualiza el ID del alimento seleccionado.
  updateFoodDialogOpen: (is: boolean) => void;              // Abre o cierra el diálogo.
  updateFoodFilters: (filters: FoodFiltersSchema) => void;  // Reemplaza todo el objeto de filtros.
  updateFoodFiltersDrawerOpen: (is: boolean) => void;       // Abre o cierra el panel de filtros.

  // Acciones más específicas para mayor comodidad:
  updateFoodFiltersPage: (action: "next" | "prev" | number) => void; // Maneja la paginación.
  updateFoodFiltersSearchTerm: (str: string) => void;                // Actualiza el término de búsqueda.
};


type Store = State & Actions; // Combina los tipos de State y Actions para crear un tipo Store.

const useFoodsStore = createStore<Store>(         // Crea un hook de almacenamiento para el estado de Store.
  (set) => ({
    selectedFoodId: null,                         // Inicializa el ID del alimento seleccionado como `null`.
    updateSelectedFoodId: (id) =>                 // Actualiza el ID del alimento seleccionado.
      set((state) => {
        state.selectedFoodId = id;
      }),
    foodDialogOpen: false,                        // Inicializa el diálogo como cerrado.
    updateFoodDialogOpen: (is) =>                 // Actualiza el estado del diálogo.
      set((state) => {
        state.foodDialogOpen = is;
      }),
    foodFilters: foodFiltersSchema.parse(foodFiltersDefaultValues), // Inicializa los filtros con valores por defecto YA VALIDADOS.
    updateFoodFilters: (filters) =>               // Actualiza los filtros de búsqueda.
      set((state) => {
        state.foodFilters = filters;
      }),
    foodFiltersDrawerOpen: false,                 // Inicializa el panel de filtros como cerrado.
    updateFoodFiltersDrawerOpen: (is) =>          // Actualiza el estado del panel de filtros.
      set((state) => {
        state.foodFiltersDrawerOpen = is;
      }),
    updateFoodFiltersPage: (action) =>            // Actualiza la paginación.
      set((state) => {                            // Si se recibe una acción de "next" o "prev", se actualiza la página.
        const currentPage = state.foodFilters.page;
        let newPage = currentPage;

        if (action === "next") {
          newPage = currentPage + 1;
        } else if (action === "prev") {
          newPage = Math.max(currentPage - 1, 1);
        } else if (typeof action === "number") {
          newPage = action;
        }

        return {
          foodFilters: {
            ...state.foodFilters,
            page: newPage,
          },
        };
      }),
    updateFoodFiltersSearchTerm: (searchTerm) =>  // Actualiza el término de búsqueda.
      set((state) => {
        state.foodFilters.searchTerm = searchTerm; 
      }),
  }),
  {
    name: "foods-store",
    excludeFromPersist: ["foodFilters"],
  },
);

export { useFoodsStore };