
import { z } from "zod";
import { patterns } from "./constant";


// El objetivo principal de este archivo es crear bloques de construcción de validación reutilizables.

// Es una forma muy limpia y reutilizable de validar campos que deben seguir un formato específico.
// Es una función que crea esquemas, una "fábrica" de validadores.
// Recibe un pattern, lo convierte a string y le aplica un regex para validarlo
const regexSchema = (pattern: RegExp) => z.coerce.string().regex(pattern); 

// Es un esquema que define las reglas para un campo de texto obligatorio y de longitud controlada.
const requiredStringSchema = z.string().min(1).max(255).trim();

// Esquema complejo y robusto para la validación de contraseñas.
const passwordSchema = z
  .string()
  .max(255)
  .refine((str) => patterns.minimumOneUpperCaseLetter.test(str), {
    message: "Minimum one upper case letter",
  })
  .refine((str) => patterns.minimumOneLowerCaseLetter.test(str), {
    message: "Minimum one lower case letter",
  })
  .refine((str) => patterns.minimumOneDigit.test(str), {
    message: "Minimum one digit",
  })
  .refine((str) => patterns.minimumOneSpecialCharacter.test(str), {
    message: "Minimum one special character",
  })
  .refine((str) => patterns.minEightCharacters.test(str), {
    message: "Minimum eight characters",
  });

export { regexSchema, requiredStringSchema, passwordSchema };