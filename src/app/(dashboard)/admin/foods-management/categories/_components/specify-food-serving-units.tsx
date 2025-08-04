import { foodSchema } from "@/app/(dashboard)/admin/foods-management/foods/_types/foodSchema";
import { ServingUnitFormDialog } from "@/app/(dashboard)/admin/foods-management/serving-units/_components/serving-unit-form-dialog";
import { useServingUnits } from "@/app/(dashboard)/admin/foods-management/serving-units/_services/useQueries";
import { Button } from "@/components/ui/button";
import { ControlledInput } from "@/components/ui/controlled/controlled-input";
import { ControlledSelect } from "@/components/ui/controlled/controlled-select";
import { CirclePlus, Trash2, UtensilsCrossed } from "lucide-react";
import { useFieldArray, useFormContext, type FieldValues } from "react-hook-form";
import { z } from "zod";

/**
 * @component SpecifyFoodServingUnits
 * @description Un componente encapsulado para gestionar una lista dinámica de unidades de medida para un alimento.
 * Utiliza `useFieldArray` de react-hook-form para manejar la adición y eliminación de filas de unidades de medida.
 * Se integra en un formulario más grande a través de `useFormContext`, lo que le permite ser reutilizable y desacoplado.
 */
const SpecifyFoodServingUnits = () => {
  // Obtiene el 'control' del formulario padre a través del contexto.
  // control Contiene todos los métodos (react-hook-form) y el estado para registrar y manejar los campos.
  // Esto evita la necesidad de pasar 'control' como prop y acopla el componente de forma flexible.
  const { control } = useFormContext<z.input<typeof foodSchema>>();

  // Hook para gestionar un array de campos del formulario.
  // Proporciona métodos para añadir (append), eliminar (remove) y acceder a los campos (fields).
  const foodServingUnits = useFieldArray({ control, name: "foodServingUnits" });

  // Obtiene la lista de todas las unidades de medida disponibles (ej: "taza", "cucharada") para poblar los menús desplegables.
  const servingUnitsQuery = useServingUnits();


  return (
    <div className="flex flex-col gap-4 rounded-md border p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Serving Units</h3>
        <Button
          size="sm"
          type="button"
          variant="outline"
          className="flex items-center gap-1"
          // Al hacer clic, añade un nuevo objeto al array 'foodServingUnits' con valores por defecto.
          // Esto dispara un nuevo renderizado con una fila de inputs adicional.
          onClick={() => {
            foodServingUnits.append({ foodServingUnitId: "", grams: "" });
          }}
        >
          <CirclePlus className="size-4" /> Add Serving Unit
        </Button>
      </div>

      {/* Renderizado condicional: si no hay unidades de medida, muestra un estado vacío amigable. */}
      {foodServingUnits.fields.length === 0 ? (
        <div className="text-muted-foreground flex flex-col items-center justify-center rounded-md border border-dashed py-6 text-center">
          <UtensilsCrossed className="mb-2 size-10 opacity-50" />
          <p>No serving units added yet</p>
          <p className="text-sm">
            Add serving units to help users measure this food
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Itera sobre el array 'fields' proporcionado por useFieldArray para renderizar cada fila de inputs. */}
          {/* 'field.id' es un ID único y estable generado por react-hook-form, ideal para usar como 'key'. */}
          {foodServingUnits.fields.map((field, index) => (
            <div
              className="grid grid-cols-[1fr_1fr_auto] items-end gap-3"
              key={field.id}
            >
              <div className="col-span-1 flex items-end">
                {/* El 'name' se construye dinámicamente para vincular este input a la posición correcta en el array del formulario. */}
                {/* Ejemplo: "foodServingUnits.0.foodServingUnitId" */}
                {/* Menu desplegable para seleccionar una unidad de medida */}
                <ControlledSelect<z.input<typeof foodSchema>>
                  label="Food Serving Unit"
                  name={`foodServingUnits.${index}.foodServingUnitId`}
                  options={servingUnitsQuery.data?.map((item) => ({ // Transforma los datos de servingUnitsQuery en opciones para el menu desplegable
                    label: item.name,
                    value: item.id,
                  }))}
                  placeholder="Select unit..."
                />
                <ServingUnitFormDialog smallTrigger />
              </div>

              <div>
                {/* Input de texto para definir cuántos gramos pesa la unidad que seleccionaste. */}
                <ControlledInput<z.input<typeof foodSchema>>
                  name={`foodServingUnits.${index}.grams`}
                  label="Grams per Unit"
                  type="number"
                  placeholder="0"
                />
              </div>
              {/* Botón para eliminar la fila de unidades de medida */}
              <Button
                size="icon"
                variant="outline"
                type="button"
                // Al hacer clic, elimina el elemento en el 'index' especificado del array 'foodServingUnits'.
                onClick={() => {
                  foodServingUnits.remove(index);
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

export { SpecifyFoodServingUnits };