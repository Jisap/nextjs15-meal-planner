"use client"

import { FormProvider, SubmitHandler, useForm, useWatch } from "react-hook-form";
import {
  foodFiltersDefaultValues,
  foodFiltersSchema,
  type FoodFiltersInput,
  type FoodFiltersSchema,
} from "../_types/foodFilterSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFoodsStore } from "../_libs/use-food-store";
import { useEffect, useMemo } from "react";
import equal from "fast-deep-equal";
import { useDebounce } from "@/lib/use-debounce";
import { useCategories } from "../../categories/_services/use-category-queries";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ControlledInput } from "@/components/ui/controlled/controlled-input";
import { Button } from "@/components/ui/button";
import { FilterIcon } from "lucide-react";
import { ControlledSelect } from "@/components/ui/controlled/controlled-select";
import { ControlledSlider } from "@/components/ui/controlled/controlled-sliders";


export const FoodFiltersDrawer = () => {

  // Usamos `FoodFiltersInput` como el tipo para el formulario. Este es el tipo de "entrada" del esquema Zod,
  // que es más flexible y maneja correctamente los tipos de datos antes de la validación (ej: números como strings).
  const form = useForm<FoodFiltersInput>({
    defaultValues: foodFiltersDefaultValues,
    resolver: zodResolver(foodFiltersSchema),
  });

  const {
    updateFoodFilters,
    foodFiltersDrawerOpen,
    updateFoodFiltersDrawerOpen,
    updateFoodFiltersSearchTerm,
    foodFilters,
  } = useFoodsStore();                                                            // Store para manejar los filtros de búsqueda.

  const areFiltersModified = useMemo(                                             // Si los filtros han cambiado, se establece un estado para mostrar un "badge" en el botón de filtros.
    () => !equal(foodFilters, foodFiltersDefaultValues),
    [foodFilters],
  );

  const searchTerm = useWatch({ control: form.control, name: "searchTerm" });      // Obtener el valor del campo de búsqueda.
  const debouncedSearchTerm = useDebounce(searchTerm, 400);                        // Debounce el valor para evitar operaciones costosas.

  useEffect(() => {                                                                // Si se cambia el término de búsqueda, 
    updateFoodFiltersSearchTerm(debouncedSearchTerm);                              // se actualiza su estado en el Store.
  }, [debouncedSearchTerm, updateFoodFiltersSearchTerm]);

  const categoriesQuery = useCategories();                                         // Query para obtener los datos de categorías.

  useEffect(() => {                                                                // Si se abre o cierra el panel de filtros, se resetea el formulario.
    if (!foodFiltersDrawerOpen) {                                                  // y se carga con los datos del filtros
      form.reset(foodFilters);                                                      
    }
  }, [foodFilters, foodFiltersDrawerOpen, form]);

  const onSubmit: SubmitHandler<FoodFiltersSchema> = (data) => {                  
    updateFoodFilters(data);
    updateFoodFiltersDrawerOpen(false);
  };

  return (
    <Drawer
      open= { foodFiltersDrawerOpen }
      onOpenChange = { updateFoodFiltersDrawerOpen }
      direction = "right"
      handleOnly
    >
      {/* 
          Este componente de react-hook-form pasa implícitamente todos
          los métodos (handleSubmit y control)
          y el estado del formulario (values, errors, isDirty, touchedFields)
          a componentes anidados, como el <ControlledInput />
          También se pasa el tipo de los datos de la validación de zod -> por eso no es necesario especificar el tipo de data en cada controller
      */}
      <FormProvider {...form}>
        <div className="flex gap-2">
          <ControlledInput
            containerClassName="max-w-48"
            name="searchTerm"
            placeholder="Quick Search"
          />
          <DrawerTrigger asChild>
            <Button variant="outline" badge={areFiltersModified}>
              <FilterIcon />
              Filters
            </Button>
          </DrawerTrigger>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit as any)}>
          <DrawerContent>
            <DrawerHeader className="text-left">
              <DrawerTitle>Filters</DrawerTitle>
              <DrawerDescription>
                Customize your food search criteria
              </DrawerDescription>
            </DrawerHeader>

            <div className="space-y-2 p-4">
              <div className="flex flex-wrap gap-2">
                <ControlledSelect
                  label="Category"
                  name="categoryId"
                  clearable
                  options={categoriesQuery.data?.map((item) => ({
                    value: item.id,
                    label: item.name,
                  }))}
                />

                <ControlledSelect
                  label="Sort By"
                  name="sortBy"
                  options={[
                    { label: "Name", value: "name" },
                    { label: "Calories", value: "calories" },
                    { label: "Carbohydrates", value: "carbohydrates" },
                    { label: "Fat", value: "fat" },
                    { label: "Protein", value: "protein" },
                  ]}
                />

                <ControlledSelect
                  label="Sort Order"
                  name="sortOrder"
                  options={[
                    { label: "Ascending", value: "asc" },
                    { label: "Descending", value: "desc" },
                  ]}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <ControlledSlider
                  name="caloriesRange"
                  label="Calories"
                  min={0}
                  max={9999}
                />
                <ControlledSlider
                  name="proteinRange"
                  label="Protein"
                  min={0}
                  max={9999}
                />
              </div>
            </div>
            
            <DrawerFooter className="pt-2">
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset(foodFiltersDefaultValues);
                }}
              >
                Reset
              </Button>
              <Button type="submit">
                Apply Filters
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </form>
      </FormProvider>
    </Drawer>
  )
}