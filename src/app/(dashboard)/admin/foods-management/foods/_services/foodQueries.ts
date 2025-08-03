"use server";

import { Prisma } from "$/generated/prisma";
import {
  FoodFiltersSchema,
  foodFiltersSchema,
} from "@/app/(dashboard)/admin/foods-management/foods/_types/foodFilterSchema";
import { FoodSchema } from "@/app/(dashboard)/admin/foods-management/foods/_types/foodSchema";
import db from "@/lib/db";
import { PaginatedResult } from "@/lib/types/paginatedResults";
import { toStringSafe } from "@/lib/utils";


type FoodWithServingUnits = Prisma.FoodGetPayload<{ // Representa todos los campos de la tabla food y ademas la relación con foodServingUnits[{}]
  include: {
    foodServingUnits: true;
  };
}>;

const getFoods = async (
  filters: FoodFiltersSchema,
): Promise<PaginatedResult<FoodWithServingUnits>> => {
  
  const validatedFilters = foodFiltersSchema.parse(filters);   // 1. Validación de los filtros de entrada

  const {                                                      // 2. Desestructuración de filtros con valores por defecto 
    searchTerm,
    caloriesRange = ["", ""],
    proteinRange = ["", ""],
    categoryId,
    sortBy = "name",
    sortOrder = "asc",
    page = 1,
    pageSize = 10,
  } = validatedFilters || {};

  const where: Prisma.FoodWhereInput = {};                      // 3. Inicialización de la condición where y lógicas para su construcción

  if (searchTerm) {
    where.name = { contains: searchTerm };                      // Si existe un término de búsqueda se agrega una condición de busqueda por dicho término
  }

  // Lógica para construir where con los rangos de calorías
  const [minCaloriesStr, maxCaloriesStr] = caloriesRange;       // Se extraen los valores del rango de calorías
  const numericMinCalories =
    minCaloriesStr === "" ? undefined : Number(minCaloriesStr); // Si el rango de calorías mínimo no está vacío se convierte a número
  const numericMaxCalories =
    maxCaloriesStr === "" ? undefined : Number(maxCaloriesStr); // Si el rango de calorías máximo no está vacío se convierte a número

  if (numericMinCalories !== undefined || numericMaxCalories !== undefined) { // Si el rango de calorías no está vacío se agrega una condición de rango numérico
    where.calories = {};
    if (numericMinCalories !== undefined)
      where.calories.gte = numericMinCalories;
    if (numericMaxCalories !== undefined)
      where.calories.lte = numericMaxCalories;
  }

  // Lógica para construir where con los rangos de proteínas
  const [minProteinStr, maxProteinStr] = proteinRange;
  const numericMinProtein =
    minProteinStr === "" ? undefined : Number(minProteinStr);
  const numericMaxProtein =
    maxProteinStr === "" ? undefined : Number(maxProteinStr);

  if (numericMinProtein !== undefined || numericMaxProtein !== undefined) {
    where.protein = {};
    if (numericMinProtein !== undefined) where.protein.gte = numericMinProtein;
    if (numericMaxProtein !== undefined) where.protein.lte = numericMaxProtein;
  }

  // Lógica para construir where con el ID de categoría
  const numericCategoryId = categoryId ? Number(categoryId) : undefined;
  if (numericCategoryId !== undefined && numericCategoryId !== 0) {
    where.category = {
      id: numericCategoryId,
    };
  }

  // Cálculo para la paginación
  const skip = (page - 1) * pageSize;

  // Ejecución de las consultas a la base de datos en paralelo
  const [total, data] = await Promise.all([
    db.food.count({ where }),
    db.food.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: pageSize,
      include: { foodServingUnits: true },
    }),
  ]);

  // Devolución de los resultados paginados
  return {
    data,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
};

const getFood = async (id: number): Promise<FoodSchema | null> => {
  const res = await db.food.findFirst({
    where: { id },
    include: {
      foodServingUnits: true,
    },
  });

  if (!res) return null;

  return {
    action: "update" as const, // El propósito de la acción es obtener los datos de un alimento existente de la base de datos para poder editarlo.
    id,
    name: toStringSafe(res.name),
    calories: toStringSafe(res.calories),
    carbohydrates: toStringSafe(res.carbohydrates),
    fat: toStringSafe(res.fat),
    fiber: toStringSafe(res.fiber),
    protein: toStringSafe(res.protein),
    sugar: toStringSafe(res.sugar),
    categoryId: toStringSafe(res.categoryId),
    foodServingUnits:
      res.foodServingUnits.map((item) => ({
        foodServingUnitId: toStringSafe(item.servingUnitId),
        grams: toStringSafe(item.grams),
      })) ?? [],
  };
};

export { getFood, getFoods };