import { passwordSchema, requiredStringSchema } from "@/lib/zod-schemas";
import { z } from "zod";

const signUpSchema = z
  .object({
    name: requiredStringSchema, 
    email: z.email(),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, { // Comprueba si los valores de los campos de password y confirmPassword son iguales
    message: "Passwords don't match",                         // Si la validación falla muestra el mensaje
    path: ["confirmPassword"],                                // Si hay un error debe asociarse al campo confirmPassword
  });

type SignUpSchema = z.infer<typeof signUpSchema>; // Valores con un tipo inferido del schema de validación

const signUpDefaultValues: SignUpSchema = {       // Valores por defecto
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export { signUpDefaultValues, signUpSchema, type SignUpSchema };