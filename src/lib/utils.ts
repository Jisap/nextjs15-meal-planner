import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import bcrypt from "bcryptjs";

const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

const toStringSafe = (
  value: string | number | null | undefined | unknown,
): string => {
  return value == null ? "" : String(value);
};

const toNumberSafe = (value: string | number | null | undefined): number => {
  if (value == null) return 0;
  if (typeof value === "number") return value;

  const parsed = Number(value);
  return isNaN(parsed) ? 0 : parsed;
};

const SALT_ROUNDS = 10; // coste
const hashPassword = async (password: string) => { // Encrypta la contraseña generando una hash = alogaritmo bcrypt + coste + sal +
  return await bcrypt.hash(password, SALT_ROUNDS);
};

const comparePassword = async (password: string, hashedPassword: string) => { // Extrae la sal y el coste, los aplica a la nueva contraseña y genera un nuevo hash
  return await bcrypt.compare(password, hashedPassword);                      // Si los hashes son iguales, la contraseña es correcta
};

export { cn, toStringSafe, toNumberSafe, hashPassword, comparePassword };
