"use client";
import { Prisma } from "$/generated/prisma";
import { MealCardsSkeleton } from "@/app/(dashboard)/client/_components/meal-cards-skeleton";

import { useMealsStore } from "@/app/(dashboard)/client/_libs/use-meal-store";
import { useDeleteMeal } from "@/app/(dashboard)/client/_services/use-meal-mutations";
import { useMeals } from "@/app/(dashboard)/client/_services/use-meal-queries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { alert } from "@/lib/use-global-store";
import { format } from "date-fns";
import {
  CalendarX,
  Edit,
  Flame,
  LineChart,
  PieChart,
  Trash,
  Utensils,
} from "lucide-react";

// Tipos inferidos de Prisma para asegurar que los datos de la API tengan el tipado correcto.
// Esto previene errores de tipado y mejora el autocompletado.
type MealWithFoods = Prisma.MealGetPayload<{
  include: {
    mealFoods: {
      include: {
        food: true;
        servingUnit: true;
      };
    };
  };
}>;

// Define un tipo para la estructura de los totales nutricionales para mayor claridad y reutilización.
type NutritionTotals = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sugar: number;
  fiber: number;
};

const MealCards = () => {

  const { updateSelectedMealId, updateMealDialogOpen, mealFilters } = useMealsStore();

  const mealsQuery = useMeals();                                               // Lista de comidas

  const deleteMealMutation = useDeleteMeal();

  const calculateTotalCalories = (                                             // Recibe los alimentos de UNA comida y devuelve el total de calorías.          
    mealFoods: MealWithFoods["mealFoods"],                                     // Recibe un array de mealFoods.
  ): number => {
    return mealFoods.reduce(
      (total: number, mealFood: MealWithFoods["mealFoods"][number]) => {       // Usa la función reduce para recorrer cada mealFood en el array.     
        const foodCalories = (mealFood.food.calories ?? 0) * mealFood.amount;  // Para cada alimento, multiplica las calorías del alimento por la cantidad consumida
        return total + foodCalories;                                           // Suma este resultado a un acumulador (total).
    }, 0);                                                                     // El valor inicial `0` establece el tipo de `total` como `number`.
  };

  const calculateNutritionTotals = (                                           // Calcula los totales nutricionales agregados (calorías, proteínas, carbohidratos, etc.) para un conjunto completo de comidas (meals).                                  
    meals: MealWithFoods[] | undefined,                                        // Opera sobre todas las comidas que se están mostrando.
  ): NutritionTotals => {
    
    const initialTotals: NutritionTotals = {                                   // Define un objeto initialTotals con todos los valores nutricionales en 0. 
      calories: 0,
      protein: 0, 
      carbs: 0, 
      fat: 0, 
      sugar: 0, 
      fiber: 0,           
    };

    if (!meals) return initialTotals;                                          // Si no hay comidas, devuelve este objeto.

    
    return meals.reduce((totals: NutritionTotals, meal: MealWithFoods) => {    // Usa reduce para recorrer cada meal en el array.
      meal.mealFoods.forEach(                                                  // Dentro de cada meal, usa forEach para recorrer cada mealFood.
        (mealFood: MealWithFoods["mealFoods"][number]) => {
          const multiplier = mealFood.amount ?? 1;                             // Calcula los nutrientes para ese alimento (ej: proteínas del alimento * cantidad) 
          totals.calories += (mealFood.food.calories ?? 0) * multiplier;       // y los suma a las propiedades correspondientes del objeto acumulador totals.
          totals.protein += (mealFood.food.protein ?? 0) * multiplier;         
          totals.carbs += (mealFood.food.carbohydrates ?? 0) * multiplier;
          totals.fat += (mealFood.food.fat ?? 0) * multiplier;
          totals.sugar += (mealFood.food.sugar ?? 0) * multiplier;
          totals.fiber += (mealFood.food.fiber ?? 0) * multiplier;
        });
      return totals;                                                            // Devuelve un único objeto NutritionTotals con la suma total de todos los macronutrientes y calorías. 
    }, initialTotals);
  };

  const nutritionTotals = calculateNutritionTotals(mealsQuery.data);            

  const displayDate = mealFilters.dateTime
    ? format(new Date(mealFilters.dateTime), "EEEE, MMMM d, yyyy")
    : "Today";

  if (mealsQuery.isLoading) {
    return <MealCardsSkeleton />;
  }

  // Botón para añadir una nueva comida cuando la lista está vacía
  if (mealsQuery.data?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <CalendarX className="text-primary mb-2" />
        <h3 className="text-lg font-medium">No meals found</h3>
        <p className="text-foreground/60 mt-1 text-sm">
          Try adjusting your filters or add new meals
        </p>
       
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => {
            updateMealDialogOpen(true); 
          }}
        >
          Add new meal
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-4 text-2xl font-bold">{displayDate}</h2>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Total Calories Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-sm font-medium">
                <Flame className="text-primary mr-2 h-4 w-4" />
                Total Calories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {nutritionTotals.calories} kcal
              </div>
            </CardContent>
          </Card>

          {/* Macronutrients Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-sm font-medium">
                <PieChart className="text-primary mr-2 h-4 w-4" />
                Macronutrients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <p className="text-muted-foreground text-xs">Protein</p>
                  <p className="font-medium">{nutritionTotals.protein}g</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Carbs</p>
                  <p className="font-medium">{nutritionTotals.carbs}g</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Fat</p>
                  <p className="font-medium">{nutritionTotals.fat}g</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Meal Summary Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-sm font-medium">
                <Utensils className="text-primary mr-2 h-4 w-4" />
                Meal Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm">Total Meals</span>
                  <span className="font-medium">
                    {mealsQuery.data?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Total Food Items</span>
                  <span className="font-medium">
                    {/* Se añade tipado explícito a los parámetros de reduce para mayor seguridad. */}
                    {(mealsQuery.data as MealWithFoods[])?.reduce(
                      (total: number, meal: MealWithFoods) =>
                        total + meal.mealFoods.length,
                      0,
                    ) || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Last Meal</span>
                  <span className="font-medium">
                    {mealsQuery.data?.length
                      ? format(new Date(mealsQuery.data[0].dateTime), "h:mm a")
                      : "N/A"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Nutrients Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-sm font-medium">
                <LineChart className="text-primary mr-2 h-4 w-4" />
                Additional Nutrients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <div>
                  <p className="text-muted-foreground text-xs">Fiber</p>
                  <p className="font-medium">{nutritionTotals.fiber}g</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Sugar</p>
                  <p className="font-medium">{nutritionTotals.sugar}g</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Meal Cards Section */}
      <div>
        <h3 className="mb-4 text-lg font-medium">Meals</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {mealsQuery.data?.map((meal) => {
            const totalCalories = calculateTotalCalories(meal.mealFoods);

            return (
              <div
                className="border-border/40 hover:border-border/80 flex flex-col gap-3 rounded-lg border p-6 transition-colors"
                key={meal.id}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">
                      {format(new Date(meal.dateTime), "PPp")}
                    </p>
                    <Badge variant="outline" className="mt-1">
                      {totalCalories} kcal
                    </Badge>
                  </div>

                  {/* Botón para editar la comida seleccionada */}
                  <div className="flex gap-1">
                    <Button
                      className="size-8"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        updateSelectedMealId(meal.id);
                        updateMealDialogOpen(true);
                      }}
                    >
                      <Edit className="size-4" />
                    </Button>
                    <Button
                      className="size-8"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        alert({
                          title: "Delete Meal",
                          description:
                            "Are you sure you want to delete this meal?",
                          onConfirm: () => deleteMealMutation.mutate(meal.id),
                        });
                      }}
                    >
                      <Trash className="size-4" />
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Utensils className="text-primary size-4" />
                    <p className="text-foreground/70 text-sm font-medium">
                      {meal.mealFoods.length}{" "}
                      {meal.mealFoods.length === 1 ? "item" : "items"}
                    </p>
                  </div>

                  {meal.mealFoods.length === 0 ? (
                    <p className="text-foreground/60 text-sm italic">
                      No foods added
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {meal.mealFoods.map((mealFood) => (
                        <div
                          key={mealFood.id}
                          className="bg-muted/40 rounded-md p-3"
                        >
                          <div className="flex items-start justify-between">
                            <p className="font-medium">{mealFood.food.name}</p>
                            <Badge variant="secondary">
                              {(mealFood.food.calories ?? 0) *
                                (mealFood.amount || 1)}{" "}
                              kcal
                            </Badge>
                          </div>

                          <div className="text-foreground/70 mt-2 flex justify-between text-sm">
                            <div>
                              <span>Serving: </span>
                              <span className="font-medium">
                                {mealFood.amount > 0
                                  ? mealFood.amount
                                  : "Not specified"}{" "}
                                {mealFood.servingUnit?.name || "units"}
                              </span>
                            </div>

                            <div className="space-x-1 text-xs">
                              <span>P: {mealFood.food.protein}g</span>
                              <span>C: {mealFood.food.carbohydrates}g</span>
                              <span>F: {mealFood.food.fat}g</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export { MealCards };