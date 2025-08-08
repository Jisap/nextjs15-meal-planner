"use client";


import { useMealsStore } from "@/app/(dashboard)/client/_libs/use-meal-store";
import {
  useCreateMeal,
  useUpdateMeal,
} from "@/app/(dashboard)/client/_services/use-meal-mutations";
import { useMeal } from "@/app/(dashboard)/client/_services/use-meal-queries";
import {
  mealDefaultValues,
  mealSchema,
  MealSchema,
} from "@/app/(dashboard)/client/_types/mealSchema";
import { Button } from "@/components/ui/button";
import { ControlledDatePicker } from "@/components/ui/controlled/controlled-date-picker";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { z } from "zod";
import { Session } from "next-auth";
import { useEffect } from "react";
import {
  FormProvider,
  SubmitHandler,
  useForm, // Hook principal de React Hook Form para inicializar y gestionar el formulario.
  useWatch,
} from "react-hook-form";
import { SpecifyMealFoods } from "./specify-meal-foods";

// Define las propiedades que el componente MealFormDialog puede recibir.
type MealFormDialogProps = {
  smallTrigger?: boolean;                                    // Prop opcional para renderizar un botón de trigger más pequeño.
  session: Session;                                          // Objeto de sesión del usuario para obtener su ID.
};

// Componente principal que renderiza un diálogo para crear o editar una comida.
const MealFormDialog = ({ smallTrigger, session }: MealFormDialogProps) => {
  
  // Inicializa el formulario con react-hook-form.
  const form = useForm<z.input<typeof mealSchema>>({         // useForm usa el tipo de entrada: Es el tipo de dato que Zod acepta para la validación.
    defaultValues: mealDefaultValues,                        // Los valores por defecto tambien son del tipo de entrada
    resolver: zodResolver(mealSchema),                       // resolver devuelve los datos validados con tipo inferido -> MealSchema
  });

  // Observa cambios en el campo 'userId' del formulario.
  const userId = useWatch({ control: form.control, name: "userId" });

  // Extrae estados y acciones del store de comidas (Zustand).
  const {
    selectedMealId,                                          // ID de la comida seleccionada para editar.
    updateSelectedMealId,                                    // Función para actualizar el ID de la comida seleccionada.
    mealDialogOpen,                                          // Estado booleano que controla si el diálogo está abierto.
    updateMealDialogOpen,                                    // Función para actualizar el estado de apertura del diálogo.
  } = useMealsStore();

  // Hooks de React Query para interactuar con la API de comidas.
  const mealQuery = useMeal();
  const createMealMutation = useCreateMeal();
  const updateMealMutation = useUpdateMeal();

  
  useEffect(() => {                                          // Efecto para cargar los datos de una comida en el formulario cuando se edita.
    if (!!selectedMealId && mealQuery.data) {                // Si hay una comida seleccionada y los datos se han cargado, resetea el formulario con esos datos
      form.reset(mealQuery.data);
    }
  }, [mealQuery.data, form, selectedMealId]);

  
  useEffect(() => {                                          // Efecto para establecer el ID del usuario en el formulario si no está presente.
    if (!userId && session?.user?.id) {                      // Si no hay userId en el formulario pero sí en la sesión, lo establece.
      form.setValue("userId", session.user.id);
    }
  }, [form, session?.user?.id, userId]);

  
  const handleDialogOpenChange = (open: boolean) => {        // Maneja el cambio de estado (abierto/cerrado) del diálogo.
    updateMealDialogOpen(open);
    
    if (!open) {                                             // Si el diálogo se cierra, limpia el ID de la comida seleccionada y resetea el formulario.
      updateSelectedMealId(null);
      form.reset(mealDefaultValues);
    }
  };

  
  const handleSuccess = () => {                             // Función que se ejecuta tras una mutación exitosa (crear/actualizar).
    handleDialogOpenChange(false);
  };

  // Manejador del envío del formulario.
  const onSubmit: SubmitHandler<MealSchema> = (data) => {
    // Determina si la acción es 'create' o 'update' y llama a la mutación correspondiente.
    if (data.action === "create") {
      createMealMutation.mutate(data, {
        onSuccess: handleSuccess,
      });
    } else {
      updateMealMutation.mutate(data, { onSuccess: handleSuccess });
    }
  };

  // Determina si alguna de las mutaciones está en curso para mostrar un estado de carga.
  const isPending =
    createMealMutation.isPending || updateMealMutation.isPending;

  return (
    <Dialog 
      open={mealDialogOpen} 
      onOpenChange={handleDialogOpenChange}
    >
      <DialogTrigger asChild>
        {smallTrigger ? (
          // Renderiza un botón pequeño si `smallTrigger` es true.
          <Button size="icon" variant="ghost" type="button">
            <Plus />
          </Button>
        ) : (
          <Button>
            <Plus className="mr-2" />
            New Meal
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {/* Título dinámico según si se está editando o creando una comida. */}
            {selectedMealId ? "Edit Meal" : "Create a New Meal"}
          </DialogTitle>
        </DialogHeader>
        <form 
          // El `as any` se usa aquí para evitar un conflicto de tipos entre la entrada y la salida del esquema Zod.
          onSubmit={form.handleSubmit(onSubmit as any)}
          className="space-y-6"
        >
          <FormProvider {...form}>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <SpecifyMealFoods />
              </div>
              <div className="col-span-2">
                {/* Componente controlado para seleccionar la fecha y hora de la comida. */}
                <ControlledDatePicker<z.input<typeof mealSchema>> name="dateTime" />
              </div>
            </div>
          </FormProvider>
          <DialogFooter>
            <Button 
              type="submit" 
              isLoading={isPending}
            >
              {!!selectedMealId ? "Edit" : "Create"} Meal
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export { MealFormDialog };