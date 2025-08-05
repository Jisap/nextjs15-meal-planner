"use client";

import { useFoodsStore } from "@/app/(dashboard)/admin/foods-management/foods/_libs/use-food-store";
import { useDeleteFood } from "@/app/(dashboard)/admin/foods-management/foods/_services/use-food-mutations";
import { useFoods } from "@/app/(dashboard)/admin/foods-management/foods/_services/use-food-queries";
import { NoItemsFound } from "@/components/no-items-found";
import { Button } from "@/components/ui/button";

import { Separator } from "@/components/ui/separator";

import { Edit, Trash } from "lucide-react";
import { FoodCardsSkeleton } from "./food-card-skeleton";
import { Pagination } from "@/components/pagination";

const FoodCards = () => {


  const {
    updateSelectedFoodId,                         // Actualiza el estado de `selectedFoodId` en el Store.
    updateFoodDialogOpen,                         // Actualiza el estado de `foodDialogOpen` en el Store.
    foodFilters,                                  // Accede al objeto de filtros de búsqueda y obtiene el estado inicial de foodFilters (que es { page: 1, pageSize: 12, searchTerm: "", ... }).
    updateFoodFiltersPage,                        // Actualiza el estado de `foodFilters.page` en el Store.
  } = useFoodsStore();

  const foodsQuery = useFoods();                  // Usamos `useFoods` para obtener los datos de alimentos.

  const deleteFoodMutation = useDeleteFood();     // Usamos `useDeleteFood` para realizar la operación de eliminación de alimentos.

  const totalPages = foodsQuery.data?.totalPages; // Obtenemos el número total de páginas.

  if (totalPages === 0) {
    return <NoItemsFound onClick={() => updateFoodDialogOpen(true)} />;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-2 lg:grid-cols-2 xl:grid-cols-4">
        {foodsQuery.isLoading ? (
          <FoodCardsSkeleton />
        ) : (
          <>
            {foodsQuery.data?.data.map((item) => (
              <div
                className="flex flex-col gap-3 rounded-lg border p-6"
                key={item.id}
              >
                <div className="flex justify-between">
                  <p className="truncate">{item.name}</p>
                  <div className="flex gap-1">
                    <Button
                      className="size-6"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        updateSelectedFoodId(item.id);
                        updateFoodDialogOpen(true);
                      }}
                    >
                      <Edit />
                    </Button>
                    <Button
                      className="size-6"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        alert({
                          onConfirm: () => deleteFoodMutation.mutate(item.id),
                        });
                      }}
                    >
                      <Trash />
                    </Button>
                  </div>
                </div>

                <Separator />
                
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <p className="text-foreground/60 text-sm font-normal">
                      Calories
                    </p>
                    <p className="text-sm font-medium">{item.calories} kcal</p>
                  </div>
                  <div>
                    <p className="text-foreground/60 text-sm font-normal">
                      Carbohydrates
                    </p>
                    <p className="text-sm font-medium">
                      {item.carbohydrates} g
                    </p>
                  </div>
                  <div>
                    <p className="text-foreground/60 text-sm font-normal">
                      Protein
                    </p>
                    <p className="text-sm font-medium">{item.protein} g</p>
                  </div>
                  <div>
                    <p className="text-foreground/60 text-sm font-normal">
                      Fat
                    </p>
                    <p className="text-sm font-medium">{item.fat} g</p>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
      <Pagination
        currentPage={foodFilters.page}
        totalPages={totalPages}
        updatePage={updateFoodFiltersPage}
      />
    </div>
  );
};

export { FoodCards };