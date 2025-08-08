
import { useQuery } from "@tanstack/react-query";
import { getMeal, getMeals } from "./mealQueries";
import { useMealsStore } from "../_libs/use-meal-store";

const useMeals = () => {
  const { mealFilters } = useMealsStore();          // Fecha por la que se filtran las comidas

  return useQuery({
    queryKey: ["meals", mealFilters],
    queryFn: () => getMeals(mealFilters),           // Se obtiene la lista de comidas filtradas
  });
};

const useMeal = () => {
  const { selectedMealId } = useMealsStore();       // ID de la comida seleccionada

  return useQuery({
    queryKey: ["meals", { selectedMealId }],
    queryFn: () => getMeal(selectedMealId!),        // Se obtiene la comida seleccionada
    enabled: !!selectedMealId,
  });
};

export { useMeals, useMeal };