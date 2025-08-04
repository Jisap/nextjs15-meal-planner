"use client"

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { 
  foodDefaultValues, 
  foodSchema, 
  FoodSchema 
} from "../_types/foodSchema";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFood } from "../_services/use-food-queries";
import { useCategories } from "../../categories/_services/use-category-queries";
import { useCreateFood, useUpdateFood } from "../_services/use-food-mutations";
import { useFoodsStore } from "../_libs/use-food-store";
import { useCategoriesStore } from "../../categories/_libs/useCategoriesStore";
import { useServingUnitsStore } from "../../serving-units/_libs/useServingUnitsStore";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ControlledInput } from "@/components/ui/controlled/controlled-input";
import { CategoryFormDialog } from "../../categories/_components/category-form-dialog";
import { ControlledSelect } from "@/components/ui/controlled/controlled-select";
import { SpecifyFoodServingUnits } from "../../categories/_components/specify-food-serving-units";
import { z } from "zod";




export const FoodFormDialog = () => {
  
  const form = useForm<z.input<typeof foodSchema>>({ // Le decimos a react-hook-form que acepte valores del esquema de zod (string, number, boolean o unknow)
    defaultValues: foodDefaultValues,                // Los valores por defecto 
    resolver: zodResolver(foodSchema) ,              // Resolver recibe los datos y los valida contra foodSchema -> si todo es correcto los transforma a tipo de salida  
  });

  const foodQuery = useFood();                                        // Query para obtener los datos de food
  const categoriesQuery = useCategories();                            // Query para obtener los datos de categories

  const createFoodMutation = useCreateFood();                         // Mutation para crear food
  const updateFoodMutation = useUpdateFood();                         // Mutation para actualizar food

  const isPending =
    createFoodMutation.isPending || updateFoodMutation.isPending;     // Si hay alguno de los dos mutation pendientes isPending es true
  
  const {
    selectedFoodId,
    updateSelectedFoodId,
    foodDialogOpen,
    updateFoodDialogOpen,
  } = useFoodsStore();                                                // Store para manejar los datos de food

  const { categoryDialogOpen } = useCategoriesStore();                // Store para manejar los datos de categories
  const { servingUnitDialogOpen } = useServingUnitsStore();           // Store para manejar los datos de servingUnits

  useEffect(() => {                                                   // Si se selecciona un alimento y se carga la query de food -> resetea el form
    if (!!selectedFoodId && foodQuery.data) {                         // y se carga el formulario con los datos del food
      form.reset(foodQuery.data);
    }
  }, [foodQuery.data, form, selectedFoodId]);

  const handleDialogOpenChange = (open: boolean) => {                 // Si se abre o cierra el dialogo -> actualiza el estado de FoodsStore
    updateFoodDialogOpen(open);                                       // y se actualiza el dialogo de food

    if (!open) {                                                      // Si se cierra el dialogo
      updateSelectedFoodId(null);                                     // se establece null en el estado de FoodsStore
      form.reset(foodDefaultValues);                                  // y se resetea el form a los valores por defecto
    }
  };

  const handleSuccess = () => {                                       // Si se crea o actualiza un alimento -> se cierra el dialogo
    handleDialogOpenChange(false);
  };

  const disabledSubmit = servingUnitDialogOpen || categoryDialogOpen; // Si se abre el dialogo de servingUnits o de categories -> se deshabilita el botón de submit

  const onSubmit: SubmitHandler<FoodSchema> = (data) => {             // onSubmit recibe los datos validados del form
    if (data.action === "create") {                                   // Si se crea un alimento
      createFoodMutation.mutate(data, {                               // se llama a la mutation de createFoodMutation  
        onSuccess: handleSuccess,                                     // y si se crea correctamente se cierra el dialogo
      });
    } else {
      updateFoodMutation.mutate(data, { onSuccess: handleSuccess });  // En caso contrario se trataría de una actualización
    }
  };

  return (
    <Dialog 
      open={foodDialogOpen} 
      onOpenChange={handleDialogOpenChange}
    >
      <DialogTrigger asChild>
        {/* Cuando se crea un alimento en el formulario se inicializa con los valores por defecto {name: "", action: "create"} -> en onSubmit el campo action tiene el valor create */}
        <Button>
          <Plus className="mr-2" />
          New Food
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {selectedFoodId ? "Edit Food" : "Create a New Food"}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={disabledSubmit ? undefined : form.handleSubmit(onSubmit as any)} // 
          className="space-y-6"
        >
          {/* 
            Se usa el FormProvider para pasar implícitamente todos 
            los métodos (handleSubmit y control) 
            y el estado del formulario (values, errors, isDirty, touchedFields)
            a componentes anidados, como el <ControlledInput />
          */}
          <FormProvider {...form}>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1 grid">
                <ControlledInput<FoodSchema>
                  name="name"
                  label="Name"
                  placeholder="Enter food name"
                />
              </div>

              <div className="col-span-1 flex items-end">
                <ControlledSelect<FoodSchema>
                  label="Category"
                  name="categoryId"
                  options={categoriesQuery.data?.map((item) => ({
                    label: item.name,
                    value: item.id,
                  }))}
                />
                <CategoryFormDialog smallTrigger />
              </div>

              <div>
                <ControlledInput<FoodSchema>
                  name="calories"
                  label="Calories"
                  type="number"
                  placeholder="kcal"
                />
              </div>
              <div>
                <ControlledInput<FoodSchema>
                  name="protein"
                  label="Protein"
                  type="number"
                  placeholder="grams"
                />
              </div>
              <div>
                <ControlledInput<FoodSchema>
                  name="carbohydrates"
                  label="Carbohydrates"
                  type="number"
                  placeholder="grams"
                />
              </div>
              <div>
                <ControlledInput<FoodSchema>
                  name="fat"
                  label="Fat"
                  type="number"
                  placeholder="grams"
                />
              </div>
              <div>
                <ControlledInput<FoodSchema>
                  name="fiber"
                  label="Fiber"
                  type="number"
                  placeholder="grams"
                />
              </div>
              <div>
                <ControlledInput<FoodSchema>
                  name="sugar"
                  label="Sugar"
                  type="number"
                  placeholder="grams"
                />
              </div>

              <div className="col-span-2">
                <SpecifyFoodServingUnits />
              </div>
              
            </div>
          </FormProvider>
          <DialogFooter>
            <Button type="submit" isLoading={isPending}>
              {!!selectedFoodId ? "Edit" : "Create"} Food
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
