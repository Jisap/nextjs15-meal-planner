"use client"

import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { categoryDefaultValues, categorySchema, CategorySchema } from '../_types/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCategoriesStore } from '../_libs/useCategoriesStore';
import { useCategory } from '../_services/use-category-queries';
import { useCreateCategory, useUpdateCategory } from '../_services/use-category-mutations';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useEffect } from 'react';
import { ControlledInput } from '@/components/ui/controlled/controlled-input';



interface CategoryFormDialogProps {
  smallTrigger?: boolean;  // Si se pasa true se renderiza un botón de icono en lugar de un botón de texto
}



export const CategoryFormDialog = ({ smallTrigger }:CategoryFormDialogProps) => {

  const form = useForm<CategorySchema>({   // Formulario de creación y actualización de categorías
    defaultValues: categoryDefaultValues,  // name: "", action: "create"
    resolver: zodResolver(categorySchema), // Validación de datos
  });

  
  const {                                                                    // Estado de CategoriesStore
    selectedCategoryId,
    categoryDialogOpen,
    updateCategoryDialogOpen,
    updateSelectedCategoryId,
  } = useCategoriesStore();

  
  const categoryQuery = useCategory();                                       // Query y mutations de categorías
  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();

  
  const isPending =                                                          // Si la mutation está pendiente isPending se establece a true
    createCategoryMutation.isPending || updateCategoryMutation.isPending;

  
  useEffect(() => {                                                          // Si se selecciona una categoría y se carga la query de categorías -> resetea el form
    if (!!selectedCategoryId && categoryQuery.data) {
      form.reset(categoryQuery.data);                                        // Se resetea el formulario con los datos de la categoría seleccionada
    }
  }, [categoryQuery.data, form, selectedCategoryId]);

  const handleDialogOpenChange = (open: boolean) => {                        // Si se abre o cierra el dialogo -> actualiza el estado de CategoriesStore
    updateCategoryDialogOpen(open);

    if (!open) {
      updateSelectedCategoryId(null);
      form.reset(categoryDefaultValues);
    }
  };

  const handleSuccess = () => {                                              // Si se crea o actualiza una categoría -> se cierra el dialogo
    handleDialogOpenChange(false);
  };

  const onSubmit: SubmitHandler<CategorySchema> = (data) => {                // SubmitHandler 
    if (data.action === "create") {                                          // Si se crea una categoría
      createCategoryMutation.mutate(data, {                                  // Se llama a la mutation de createCategoryMutation
        onSuccess: handleSuccess,                                            // y si se crea correctamente se cierra el dialogo
      });
    } else {                                                                 // En caso contrario se trataría de una actualización
      updateCategoryMutation.mutate(data, {                                  // Se llama a la mutation de updateCategoryMutation
        onSuccess: handleSuccess                                             // y si se actualiza correctamente se cierra el dialogo
      });     
    }
  };


  return (
    <Dialog 
      open={categoryDialogOpen} 
      onOpenChange={handleDialogOpenChange}
    >
      <DialogTrigger asChild>
        {smallTrigger ? (
          <Button size="icon" variant="ghost" type="button">
            <Plus />
          </Button>
        ) : (
          // Cuando se crea una categoría el formulario se inicializa con los valores por defecto {name: "", action: "create"} -> en onSubmit el campo action tiene el valor create
          <Button>
            <Plus className="mr-2" />
            New Category
          </Button>
        )}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {selectedCategoryId ? "Edit Category" : "Create a New Category"}
          </DialogTitle>
        </DialogHeader>

        <form 
          onSubmit={form.handleSubmit(onSubmit)} 
          className="space-y-6"
        >
          {/* 
            Se usa el FormProvider para pasar implícitamente todos 
            los métodos (handleSubmit y control) 
            y el estado del formulario (values, errors, isDirty, touchedFields)
            a componentes anidados, como el <ControlledInput />
          */}
          <FormProvider {...form}>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <ControlledInput<CategorySchema>
                  name="name"
                  label="Name"
                  placeholder="Enter category name"
                />
              </div>
            </div>
          </FormProvider>

          <DialogFooter>
            <Button 
              type="submit" 
              isLoading={isPending}
            >
              {!!selectedCategoryId ? "Edit" : "Create"} Category
            </Button>
          </DialogFooter>
        </form>

      </DialogContent>
    </Dialog>
  );
};
