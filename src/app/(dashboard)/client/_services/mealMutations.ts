"use server";

import {
  mealSchema,
  MealSchema,
} from "@/app/(dashboard)/client/_types/mealSchema";
import db from "@/lib/db";
import { executeAction } from "@/lib/executeAction";
import { toNumberSafe } from "@/lib/utils";

const createMeal = async (data: MealSchema) => {
  await executeAction({
    actionFn: async () => {
      const validatedData = mealSchema.parse(data);    // Validamos los datos del plan de comida

      const meal = await db.meal.create({              // Se crea el plan de comida en la base de datos. Cada Meal debe tener una serie de alimentos MealFoods
        data: {                                        // En principio solo tenemos el userId y la fecha de creación
          userId: toNumberSafe(validatedData.userId),
          dateTime: validatedData.dateTime,
        },
      });

      await Promise.all(
        validatedData.mealFoods.map(async (food) => {  // Acontinuación se crean los alimentos del plan de comida en la tabla MealFood que provienen validatedData
          await db.mealFood.create({
            data: {
              mealId: meal.id,
              foodId: toNumberSafe(food.foodId),
              amount: toNumberSafe(food.amount),
              servingUnitId: toNumberSafe(food.servingUnitId),
            },
          });
        }),
      );
    },
  });
};

const updateMeal = async (data: MealSchema) => {
  await executeAction({
    actionFn: async () => {
      const validatedData = mealSchema.parse(data);
      if (validatedData.action === "update") {                        // Si se está actualizando un plan de comida
        await db.meal.update({                                        // Se actualiza el plan de comida en la base de datos
          where: { id: validatedData.id },                
          data: {
            dateTime: validatedData.dateTime,                         // con la fecha de creación
          },
        });

        await db.mealFood.deleteMany({                                // Luego se borra los alimentos de mealFood correspondientes a la relación MealFoods                   
          where: { mealId: validatedData.id },
        });

        await Promise.all(                                            // Y finalmente se crean los alimentos de mealFoods correspondientes a los nuevos datos.
          validatedData.mealFoods.map(async (food) => {
            await db.mealFood.create({
              data: {
                mealId: validatedData.id,
                foodId: toNumberSafe(food.foodId),
                servingUnitId: toNumberSafe(food.servingUnitId),
                amount: toNumberSafe(food.amount),
              },
            });
          }),
        );
      }
    },
  });
};

const deleteMeal = async (id: number) => {
  await executeAction({
    actionFn: async () => {
      await db.mealFood.deleteMany({
        where: { mealId: id },
      });

      await db.meal.delete({ where: { id } });
    },
  });
};

export { createMeal, deleteMeal, updateMeal };