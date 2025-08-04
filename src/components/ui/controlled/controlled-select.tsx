"use client";

import { ValueLabel } from "@/lib/types/valueLabel";
import { Controller, FieldValues, Path, useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../select";
import { Button } from "../button";
import { X } from "lucide-react";

type SelectProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  options?: ValueLabel[];
  placeholder?: string;
  clearable?: boolean;
};

export const ControlledSelect = <T extends FieldValues>({
  name,
  label,
  options = [],
  placeholder,
  clearable,
}: SelectProps<T>) => {

  const { control } = useFormContext();         // control Contiene todos los métodos de react-hook-form para registrar y controlar campos (onChange, onBlur, handleSubmit, watch, getValues, setValues, reset), manejar el formulario (handleSubmit, formState) e interactuar con los valores (watch, getValues, setValues, reset)

  return (
    <div className="w-full">
      {!!label && (
        <Label className="mb-2" htmlFor={name}>
          {label}
        </Label>
      )}

      {/* Este es el componente principal de react-hook-form para integrar componentes de UI controlados como shadcn */}
      <Controller
        name={name}                                             // Le dice a Controller a que campo del formulario debe suscribirse
        control={control}                                       // Le pasa el objeto control que obtuvimos del contexto
        render={({                                              // Renderiza el componente Select
          field: { onChange, ...restField },                    // Contiene el value, el onChange, onBlur, ref y name
          fieldState: { error },                                // Contiene información sobre el estado del campo (error, isDirty, etc)
        }) => (
          <>
            <Select 
              onValueChange={onChange}  // Se le pasa el onChange de react-hook-form a Select para actualizar el valor del campo
              {...restField}            // Le pasa el resto de las props del campo (value, onBlur, name, ref) al componente Select

            >
              <div className="relative flex">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                {clearable && !!restField.value && (
                  <Button
                    variant="ghost"
                    className="text-foreground/40 hover:bg-accent/0 absolute top-1/2 right-8 size-4 -translate-y-1/2"
                    size="icon"
                    onClick={() => {
                      onChange("");
                    }}
                  >
                    <X />
                  </Button>
                )}
              </div>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{label}</SelectLabel>
                  {options.map((item) => (
                    <SelectItem value={item.value.toString()} key={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            {!!error && (
              <p className="text-destructive text-sm">{error.message}</p>
            )}
          </>
        )}
      />
    </div>
  )

}