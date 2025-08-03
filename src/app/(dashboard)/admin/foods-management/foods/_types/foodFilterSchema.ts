
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
  page: z.number(),                                                  // El número de la página actual para la paginación.
  pageSize: z.number().max(100),                                     // El número de elementos a mostrar por página.
});

type FoodFiltersSchema = z.infer<typeof foodFiltersSchema>;

const foodFiltersDefaultValues: FoodFiltersSchema = {
  searchTerm: "",
  caloriesRange: ["0", "9999"],
  proteinRange: ["0", "9999"],
  categoryId: "",
  sortBy: "name",
  sortOrder: "desc",
  pageSize: 12,
  page: 1,
};

export { foodFiltersSchema, type FoodFiltersSchema, foodFiltersDefaultValues };