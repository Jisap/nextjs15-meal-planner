
import { patterns } from "@/lib/constant";
import { regexSchema, requiredStringSchema } from "@/lib/zod-schemas";
import { z } from "zod";

const mealSchema = z.intersection(
  z.object({
    userId: requiredStringSchema,
    dateTime: z.date(),
    mealFoods: z.array(
      z.object({
        foodId: requiredStringSchema,
        servingUnitId: requiredStringSchema,
        amount: regexSchema(patterns.zeroTo9999),
      }),
    ),
  }),
  z.discriminatedUnion("action", [
    z.object({ action: z.literal("create") }),
    z.object({ action: z.literal("update"), id: z.number() }),
  ]),
);

type MealSchema = z.infer<typeof mealSchema>; // Tipo de salida: Tipo de dato que obtienes después de que Zod ha validado y transformado (coercido) los datos.

const mealDefaultValues: z.input<typeof mealSchema> = {
  action: "create",
  dateTime: new Date(),
  mealFoods: [],
  userId: "",
};

export { mealDefaultValues, mealSchema, type MealSchema };