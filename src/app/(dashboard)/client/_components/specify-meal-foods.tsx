import { useFoods } from "@/app/(dashboard)/admin/foods-management/foods/_services/use-food-queries";
import { useServingUnits } from "@/app/(dashboard)/admin/foods-management/serving-units/_services/useQueries";
import { mealSchema } from "@/app/(dashboard)/client/_types/mealSchema";
import { Button } from "@/components/ui/button";
import { ControlledInput } from "@/components/ui/controlled/controlled-input";
import { ControlledSelect } from "@/components/ui/controlled/controlled-select";
import { CirclePlus, Trash2, UtensilsCrossed } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { z } from "zod";

const SpecifyMealFoods = () => {

  const { control } = useFormContext<z.input<typeof mealSchema>>(); // 
  
  const mealFoods = useFieldArray({ // Array de "mealFoods" (basado en mealSchema) con metodos y props para manipular la lista. Se incorpora al formulario
    control,                        // Le da acceso a las propiedades del formulario padre 
    name: "mealFoods"               // Nombre del campo de mealSchema que es un array 
  });  

  const foodsQuery = useFoods();                // Lista de alimentos
  const servingUnitsQuery = useServingUnits();  // Lista de unidades de medida

  return (
    <div className="flex flex-col gap-4 rounded-md border p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Foods</h3>
        <Button
          size="sm"
          type="button"
          variant="outline"
          className="flex items-center gap-1"
          onClick={() => {
            mealFoods.append({      // Es una función que añade un nuevo elemento al final del array
              foodId: "",           // El objeto que se pasa define valores por defecto
              servingUnitId: "",    // react-hook-form recibe este objeto y lo añade a su estado interno
              amount: "0"           // El componente se vuelve a renderizar y todos los Controlled recibiran un campo vacío
            });  
          }}
        >
          <CirclePlus className="size-4" /> Add Food
        </Button>
      </div>

      {mealFoods.fields.length === 0 ? (
        <div className="text-muted-foreground flex flex-col items-center justify-center rounded-md border border-dashed py-6 text-center">
          <UtensilsCrossed className="mb-2 size-10 opacity-50" />
          <p>No foods added to this meal yet</p>
          <p className="text-sm">
            Add foods to track what you&apos;re eating in this meal
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {mealFoods.fields.map((field, index) => (
            <div
              className="grid grid-cols-[1fr_1fr_1fr_auto] items-end gap-3"
              key={field.id}
            >
              <div>
                <ControlledSelect<z.input<typeof mealSchema>>
                  label="Food"
                  name={`mealFoods.${index}.foodId`}
                  options={foodsQuery.data?.data.map((item) => ({ // Se crean las opciones de alimentos según id
                    label: item.name,                             // Cuando el usuario ve la fila vacia selecciona un value de los disponibles
                    value: item.id,                               // y asigna ese valor de id a al foodId que se esta renderizando
                  }))}                                            // Los valores de este subformulario son recogidos por el form padre <meal-form-dialog>                                           
                  placeholder="Select food..."
                />
              </div>

              <div>
                <ControlledSelect<z.input<typeof mealSchema>>
                  label="Serving Unit"
                  name={`mealFoods.${index}.servingUnitId`}
                  options={servingUnitsQuery.data?.map((item) => ({
                    label: item.name,
                    value: item.id,
                  }))}
                  placeholder="Select unit..."
                />
              </div>

              <div>
                <ControlledInput<z.input<typeof mealSchema>>
                  name={`mealFoods.${index}.amount`}
                  label="Amount"
                  type="number"
                  placeholder="0"
                />
              </div>

              <Button
                size="icon"
                variant="outline"
                type="button"
                onClick={() => {
                  mealFoods.remove(index);
                }}
              >
                <Trash2 />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export { SpecifyMealFoods };