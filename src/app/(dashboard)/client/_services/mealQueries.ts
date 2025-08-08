"use server";

import { Prisma } from "$/generated/prisma";
import {
  mealFiltersSchema,
  MealFiltersSchema,
} from "@/app/(dashboard)/client/_types/mealFilterSchema";
import { auth } from "@/lib/auth";
import db from "@/lib/db";
import { toStringSafe } from "@/lib/utils";
import { MealSchema } from "../_types/mealSchema";


const getMeals = async (filters: MealFiltersSchema) => {                // Obtiene la lista de comidas según fecha de creación concreta 

  const validatedFilters = mealFiltersSchema.parse(filters);            // Validamos la fecha de creación

  const session = await auth();                                         // Se obtiene el session del usuario

  const { dateTime } = validatedFilters || {};                          // Desestructuramos la fecha de creación si existe

  const where: Prisma.MealWhereInput = {};                              // Se crea un objeto donde se almacenarán las condiciones de búsqueda

  if (dateTime !== undefined) {                                         // Si la fecha de creación existe
    const startDate = new Date(dateTime);                               // Se crea un objeto Date para la fecha de comiezo de la comida
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(dateTime);                                 // Y otro para la fecha de fin
    endDate.setHours(23, 59, 59, 999);
    
    where.dateTime = {                                                  // Se agrega la condición de fecha de creación
      gte: startDate,
      lte: endDate,
    };
  }

  if (session?.user?.id) {                                              // Si el usuario está logeado
    where.userId = {                                                    // Se agrega la condición de usuario
      equals: +session.user.id,                                         // donde el id del usuario es igual al al id del usuario logueado en la session
    };
  }

  const data = await db.meal.findMany({                                 // Se realiza la consulta a la base de datos
    where,                                                              // donde se aplican las condiciones de búsqueda: fecha de creación/finalización y usuario
    orderBy: { dateTime: "desc" },
    include: {
      mealFoods: {
        include: {
          food: true,
          servingUnit: true,
        },
      },
    },
  });

  return data;
};

const getMeal = async (id: number): Promise<MealSchema | null> => {     // Obtener los datos de una comida que ya existe en la base de datos para que el usuario pueda editarlos o actualizarlos.
  
  const res = await db.meal.findFirst({                                 // Buscamos la comida en la base de datos según su id
    where: { id },
    include: {
      mealFoods: true,
    },
  });

  if (!res) return null;

  return {                                                              // Si la comida existe se devuelve el objeto con los datos
    action: "update" as const,
    id,
    dateTime: res.dateTime,
    userId: toStringSafe(res.userId),
    mealFoods:
      res.mealFoods.map((item) => ({
        foodId: toStringSafe(item.foodId),
        amount: toStringSafe(item.amount),
        servingUnitId: toStringSafe(item.servingUnitId),
      })) ?? [],
  };
};

export { getMeal, getMeals };