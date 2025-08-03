"use server";

import {
  FoodSchema,
  foodSchema,
} from "@/app/(dashboard)/admin/foods-management/foods/_types/foodSchema";
import db from "@/lib/db";
import { executeAction } from "@/lib/executeAction";
import { toNumberSafe } from "@/lib/utils";

const mapFoodData = (validatedData: FoodSchema) => ({            // Convierten los datos del formulario (que son strings) a los tipos  
  name: validatedData.name,                                      // que la base de datos espera (números, etc.) usando tu helper toNumberSafe.
  calories: toNumberSafe(validatedData.calories),
  carbohydrates: toNumberSafe(validatedData.carbohydrates),
  fat: toNumberSafe(validatedData.fat),
  fiber: toNumberSafe(validatedData.fiber),
  sugar: toNumberSafe(validatedData.sugar),
  protein: toNumberSafe(validatedData.protein),
  categoryId: toNumberSafe(validatedData.categoryId) || null,
});

const createFood = async (data: FoodSchema) => {                  // Se recibe un objeto con los datos del formulario (FoodSchema)
  await executeAction({
    actionFn: async () => {
      const validatedData = foodSchema.parse(data);               // Validación con zod (foodSchema) de los datos del formulario  

      const food = await db.food.create({                         // Se crea el alimento en la base de datos con la data convertida con mapFooData
        data: mapFoodData(validatedData),
      });

      await Promise.all(                                          // Se crean las unidades de medida de los alimentos
        validatedData.foodServingUnits.map(async (unit) => {
          await db.foodServingUnit.create({
            data: {
              foodId: food.id,
              servingUnitId: toNumberSafe(unit.foodServingUnitId),
              grams: toNumberSafe(unit.grams),
            },
          });
        }),
      );
    },
  });
};

const updateFood = async (data: FoodSchema) => {
  await executeAction({                                               // Middleware de ejecucíon de acciones y captura de errores
    actionFn: async () => {
      const validatedData = foodSchema.parse(data);                   // Validación con zod (foodSchema) de los datos del formulario
      if (validatedData.action === "update") {                        // Si la action es "update"
        await db.$transaction(async (prisma) => {                     // ejecutamos todas las acciones en una sola transacción. O todo tiene éxito, o no se hace nada
          await prisma.food.update({                                  // 1º actualizamos el alimento en la base de datos
            where: { id: validatedData.id },
            data: mapFoodData(validatedData),
          });

          await prisma.foodServingUnit.deleteMany({                   // 2º eliminamos las unidades de medida asociadas al alimento
            where: { foodId: validatedData.id },
          });

          if (validatedData.foodServingUnits.length > 0) {
            await prisma.foodServingUnit.createMany({                 // 3º creamos las nuevas unidades de medida asociadas al alimento actualizado
              data: validatedData.foodServingUnits.map((unit) => ({   // createMany es mucho más eficiente porque toma un array de objetos y los inserta todos en la bd con una sola consulta sql
                foodId: validatedData.id,                             // El ID del alimento es el mismo para todos
                servingUnitId: toNumberSafe(unit.foodServingUnitId),  // El ID de la unidad de medida de esta iteración
                grams: toNumberSafe(unit.grams),                      // Los gramos de esta iteración
              })),
            });
          }
        });
      }
    },
  });
};

const deleteFood = async (id: number) => {
  await executeAction({
    actionFn: async () => {
      await db.$transaction(async (prisma) => {
        await prisma.foodServingUnit.deleteMany({
          where: { foodId: id },
        });

        await prisma.food.delete({ where: { id } });
      });
    },
  });
};

export { createFood, deleteFood, updateFood };