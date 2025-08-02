"use client"

import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { Category } from '../../../../../../../generated/prisma/index';
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
  smallTrigger?: boolean;
}



const CategoryFormDialog = ({ smallTrigger }:CategoryFormDialogProps) => {

  const form = useForm<CategorySchema>({
    defaultValues: categoryDefaultValues, // name: "", action: "create"
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
      form.reset(categoryQuery.data);
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
    <Dialog open={categoryDialogOpen} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        {smallTrigger ? (
          <Button size="icon" variant="ghost" type="button">
            <Plus />
          </Button>
        ) : (
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
