import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

const toStringSafe = (
  value: string | number | null | undefined | unknown,
): string => {
  return value == null ? "" : String(value);
};

export { cn, toStringSafe }
