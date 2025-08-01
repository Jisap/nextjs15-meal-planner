import { z } from "zod";

const customErrorMap: z.ZodErrorMap = (issue) => {
  // El caso 'default' ya no puede usar 'ctx.defaultError'
  // porque 'ctx' ya no existe. Debes proporcionar tu propio
  // mensaje genérico de fallback.
  let message: string = "Error de validación";

  switch (issue.code) {
    case z.ZodIssueCode.invalid_type:
      if (issue.received === "undefined" || issue.received === "null") {
        message = "Este campo es requerido";
      } else if (issue.expected === "string") {
        message = "Por favor, introduce texto";
      } else if (issue.expected === "number") {
        message = "Por favor, introduce un número";
      } else if (issue.expected === "date") {
        message = "Por favor, introduce una fecha válida";
      } else {
        message = `Tipo de valor inválido`;
      }
      break;

    case z.ZodIssueCode.too_small:
      if (issue.type === "string") {
        message = `Se requieren un mínimo de ${issue.minimum} caracteres`;
      } else if (issue.type === "number") {
        message = `El número debe ser mayor o igual que ${issue.minimum}`;
      } else {
        message = `El valor es demasiado pequeño`;
      }
      break;

    case z.ZodIssueCode.too_big:
      if (issue.type === "string") {
        message = `Se permiten un máximo de ${issue.maximum} caracteres`;
      } else if (issue.type === "number") {
        message = `El número debe ser menor o igual que ${issue.maximum}`;
      } else {
        message = `El valor es demasiado grande`;
      }
      break;

    case z.ZodIssueCode.invalid_format:
      if (issue.validation === "email") {
        message = "Por favor, introduce un email válido";
      } else if (issue.validation === "url") {
        message = "Por favor, introduce una URL válida";
      } else {
        message = "Formato de texto inválido";
      }
      break;

    case z.ZodIssueCode.custom:
      // Para los errores custom, el mensaje viene en el propio issue.
      message = issue.message || "Valor inválido";
      break;

    // No hay 'default' porque ya hemos establecido un mensaje genérico al inicio.
  }

  return { message };
};

export { customErrorMap };