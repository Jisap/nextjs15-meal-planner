"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ComponentProps } from "react";
import { Controller, FieldValues, Path, useFormContext } from "react-hook-form";

// ControlledInput es un componente reutilizable que actúa como un puente entre un campo de entrada 
// de UI (el <Input> de shadcn/ui) y la librería de manejo de formularios react-hook-form.

type InputProps<T extends FieldValues> = {
  name: Path<T>;                                          // nombre del campo en tu formulario (ej: "email", "password"). El tipo T asegura que solo se puede pasar un campo válido del schema del formulario
  label?: string;                                         // texto opcional para mostrar en una etiqueta (<Label>  
  containerClassName?: string;                            // clase opcional para el contenedor del campo
} & ComponentProps<"input">;                              // "Hereda" todas las props que un <input> normal de HTML aceptaría

const ControlledInput = <T extends FieldValues>({
  className,
  type,
  name,
  label,
  containerClassName,
  ...props
}: InputProps<T>) => {
                                                           
  const { control } = useFormContext<T>();                 // control Contiene todos los métodos (react-hook-form) y el estado para registrar y manejar los campos.

  return (
    <div className={cn("w-full", containerClassName)}>    
      {!!label && (
        <Label className="mb-2" htmlFor={name}>
          {label}
        </Label>
      )}

      {/* Este es el componente principal de react-hook-form para integrar componentes de UI controlados como shadcn */}
      <Controller
        name={name}                                        // Le dice a Controller a que campo del formulario debe suscribirse
        control={control}                                  // Le pasa el objeto control que obtuvimos del contexto
        render={({                                         // Renderiza el componente Input
          field,                                           // Contiene el value, el onChange, onBlur, ref y name
          fieldState: { error }                            // Contiene información sobre el estado del campo (error, isDirty, etc)
        }) => (     
          <>
            <Input
              type={type}
              id={name}
              data-slot="input"
              aria-invalid={!!error}
              className={className}
              {...field}                                    // Le estamos pasando automáticamente las props value, onChange y onBlur -> react-hook-form se encarga de actualizar el value cuando el usuario escribe de registrar cuand el campo pierde el foco
              {...props}                                    // Pasa el resto de las props de <input> (como placeholder) al componente <Input>.
            />
            {!!error && (
              <p className="text-destructive text-sm">{error.message}</p>
            )}
          </>
        )}
      />
    </div>
  );
};

export { ControlledInput };