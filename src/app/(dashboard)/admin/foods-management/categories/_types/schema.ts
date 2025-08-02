import { z } from "zod";


// Esquema de validación para la creación y actualización de categorías

const categorySchema = z.intersection(                                   // Los datos son válidos si cumplen las condiciones de ambos objetos
  z.object({
    name: z.string().min(3).max(255),                                    // name es requerido y debe tener entre 1 y 255 caracteres
  }),
  z.discriminatedUnion("action", [                                       // y el campo action debe ser "create" o "update"
    z.object({ action: z.literal("create") }),
    z.object({ action: z.literal("update"), id: z.number().min(1) }),    // ademas si action es update se generará un id
  ]),
);

type CategorySchema = z.infer<typeof categorySchema>;                    // Tipo de datos que se espera que cumplan las validaciones

const categoryDefaultValues: CategorySchema = {                          // Valores por defecto para el formulario
  action: "create",
  name: "",
};

export { categorySchema, categoryDefaultValues, type CategorySchema };   