
import { patterns } from "@/lib/constant";
import { regexSchema } from "@/lib/zod-schemas";
import { z } from "zod";

// Aqui se define la estructura y las reglas de validación para los filtros de búsqueda de alimentos

const foodFiltersSchema = z.object({
  searchTerm: z.string(),                                            // Un campo de texto simple para que el usuario escriba lo que busca.
  caloriesRange: z.tuple([                                           // Un campo de rango numérico para que el usuario seleccione el rango de calorías.
    regexSchema(patterns.zeroTo9999),
    regexSchema(patterns.zeroTo9999),
  ]),
  proteinRange: z.tuple([                                            // Un campo de rango numérico para que el usuario seleccione el rango de proteínas.
    regexSchema(patterns.zeroTo9999),
    regexSchema(patterns.zeroTo9999),
  ]),
  categoryId: z.string(),                                            // Un string para filtrar por el ID de una categoría específica.
  sortBy: z
    .enum(["name", "calories", "protein", "carbohydrates", "fat"])   // El campo por el cual se ordenará la lista
    .optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),                     // El orden (ascendente o descendente).    
  page: z.coerce.number(),                                           // El número de la página actual para la paginación. Tipo number gracias a coerce
  pageSize: z.coerce.number().max(100),                              // El número de elementos a mostrar por página. Tipo number gracias a coerce
});

// El tipo `FoodFiltersSchema` representa la forma de los datos DESPUÉS (z.infer) de la validación y coerción de Zod.
// Es el tipo que recibirás en el `onSubmit` del formulario.
// Es el tipo para el "viaje" del formulario (valores por defecto, estado interno, componentes controlados)
type FoodFiltersSchema = z.infer<typeof foodFiltersSchema>;

// El tipo `FoodFiltersInput` representa la forma de los datos ANTES (z.input) de la validación.
// Es el tipo que `react-hook-form` maneja internamente y es ideal para los `defaultValues`.
// Es el tipo para el "viaje" del formulario (valores por defecto, estado interno, componentes controlados)
type FoodFiltersInput = z.input<typeof foodFiltersSchema>;

const foodFiltersDefaultValues: FoodFiltersInput = {
  searchTerm: "",
  caloriesRange: ["0", "9999"],
  proteinRange: ["0", "9999"],
  categoryId: "",
  sortBy: "name",
  sortOrder: "desc",
  pageSize: 12, // el tipo de entrada puede ser cualquier tipo que zod pueda forzar a ser número
  page: 1,
};

export {
  foodFiltersSchema,
  type FoodFiltersSchema,
  type FoodFiltersInput,
  foodFiltersDefaultValues,
};