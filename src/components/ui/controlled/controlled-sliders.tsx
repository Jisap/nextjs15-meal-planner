"use client";

import { cn } from "@/lib/utils";
import * as SliderPrimitive from "@radix-ui/react-slider";
import * as React from "react";
import { Controller, FieldValues, Path, useFormContext } from "react-hook-form";


interface SliderProps<T extends FieldValues>                       // SliderProps es una interfaz que define las propiedades del componente ControlledSlider. T - El tipo de los valores del formulario, debe extender FieldValues de react-hook-form
  extends React.ComponentProps<typeof SliderPrimitive.Root> {      // Extende la interfaz de SliderPrimitive.Root, que es la raíz del componente de slider de Radix UI.
  name: Path<T>;                                                   // name es el nombre del campo en tu formulario (ej: "email", "password"). El tipo T asegura que solo se puede pasar un campo válido del schema del formulario
  label?: string;                                                  // label es una etiqueta opcional que se muestra sobre el slider.
  minStepsBetweenThumbs?: number;                                  // Distancia mínima entre los pulgares del slider                  
}

/**
 * @component ControlledSlider
 * @description Un componente de slider de rango, construido sobre Radix UI y diseñado para integrarse
 * perfectamente con react-hook-form a través del componente Controller.
 * Debe ser utilizado dentro de un FormProvider.
 */
function ControlledSlider<T extends FieldValues>({
  className,
  name,
  label = "Price Range",
  defaultValue,
  min = 0,
  max = 100,
  minStepsBetweenThumbs = 1,
  ...props
}: SliderProps<T>) {

  // Obtiene el objeto 'control' del contexto del formulario.
  // control Contiene todos los métodos (react-hook-form) y el estado para registrar y manejar los campos.
  // Esto permite que el componente se conecte al estado del formulario sin necesidad de prop-drilling.
  const { control } = useFormContext<T>();

  return (
    // Controller es el componente de react-hook-form que hace de puente entre el estado del formulario
    // y el componente de UI.
    <Controller
      name={name}                   // Le dice a react-hook-form que existe un campo name expecífico
      control={control}             // Le pasa el objeto control que obtuvimos del contexto
      render={({ field }) => {      // Proporciona un objeto field a su funcion render. Este objeto contiene todo lo necesario para conectar el estado (value, onChange, onBlur, ref) 
        // Determina de forma segura los valores a mostrar. Prioriza el valor del formulario,
        // luego el defaultValue, y finalmente el rango completo [min, max].
        const values = Array.isArray(field.value)
          ? field.value
          : Array.isArray(defaultValue)
            ? defaultValue
            : [min, max];

        const handleValueChange = (newValues: number[]) => {
          // Lógica personalizada para asegurar una distancia mínima entre los pulgares del slider.
          // Si la nueva posición viola esta regla, la actualización de estado se ignora,
          // evitando que los pulgares se superpongan o se acerquen demasiado.
          if (minStepsBetweenThumbs > 1 && newValues.length > 1) {
            for (let i = 0; i < newValues.length - 1; i++) {
              if (newValues[i + 1] - newValues[i] < minStepsBetweenThumbs) {
                return;
              }
            }
          }
          field.onChange(newValues);
        };

        return (
          <div className="grid w-full gap-4 rounded-md border border-[#14424C]/20 p-4">
            <div className="flex items-center justify-between">
              {label && (
                <label className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {label}
                </label>
              )}
            </div>

            {/* Componente raíz del slider de Radix UI. Se le pasan los valores y el manejador de cambios
                proporcionados por el Controller de react-hook-form. */}
            <SliderPrimitive.Root
              data-slot="slider"
              value={field.value ?? values}
              min={min}
              max={max}
              onValueChange={handleValueChange}
              className={cn(
                "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
                className,
              )}
              {...props}
            >
              <SliderPrimitive.Track
                data-slot="slider-track"
                className={cn(
                  "bg-muted relative grow cursor-pointer overflow-hidden rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5",
                )}
              >
                <SliderPrimitive.Range
                  data-slot="slider-range"
                  className={cn(
                    "bg-primary absolute cursor-pointer data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full",
                  )}
                />
              </SliderPrimitive.Track>
              {/* Renderiza un "pulgar" (thumb) por cada valor en el array.
                  Esto permite que el slider funcione tanto con un solo valor como con un rango. */}
              {values.map((_, index) => (
                <SliderPrimitive.Thumb
                  data-slot="slider-thumb"
                  key={index}
                  className="border-primary bg-background ring-ring/50 block size-4 shrink-0 cursor-pointer rounded-full border shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
                />
              ))}
            </SliderPrimitive.Root>

            <div className="flex flex-wrap gap-2">
              {/* Muestra los valores actuales del slider (mínimo y máximo) de forma legible. */}
              <ol className="flex w-full items-center gap-3">
                {values.map((singleValue, index) => (
                  <li
                    key={index}
                    className="flex h-10 w-full items-center justify-between rounded-md border px-3"
                  >
                    <span>{index === 0 ? "Min" : "Max"}</span>
                    <span>{singleValue.toLocaleString()}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        );
      }}
    />
  );
}

export { ControlledSlider };