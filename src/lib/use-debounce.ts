import { useEffect, useState } from "react";

/**
 * Un hook personalizado que retrasa la actualización de un valor. Es útil para
 * evitar operaciones costosas (como llamadas a API) en cada cambio de un input.
 * @param value El valor a "debounce".
 * @param delay El retraso en milisegundos antes de actualizar el valor.
 * @returns El valor "debounced" (retrasado).
 */
const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, value]);

  return debouncedValue;
};

export { useDebounce };