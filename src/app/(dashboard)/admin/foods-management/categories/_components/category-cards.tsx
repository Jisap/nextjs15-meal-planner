"use client"

import React from 'react'
import { useCategories } from '../_services/use-category-queries'
import { useDeleteCategory } from '../_services/use-category-mutations';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';
import { alert } from '@/lib/use-global-store';
import { useCategoriesStore } from '../_libs/useCategoriesStore';
import { CategoryCardsSkeleton } from './category-cards-skeleton';
import { NoItemsFound } from '@/components/no-items-found';


const CategoryCards = () => {

  // action: "create": Es el valor por defecto al iniciar el formulario.
  // action: "update": Se establece dinámicamente al cargar los datos de una categoría existente para su edición.

  const {                                               // Estado de CategoriesStore
    updateSelectedCategoryId,                           // Dispara los hooks de querys y mutations de categorías cuando cambia -> cambia el tipo de action en el formulario
    updateCategoryDialogOpen 
  } = useCategoriesStore();                             

  const categoriesQuery = useCategories();              // Query para obtener los datos de las categorías
  const deleteCategoryMutation = useDeleteCategory();   // Mutación para eliminar una categoría

  if(categoriesQuery.data?.length === 0){
    return (
      <NoItemsFound 
        onClick={() => updateCategoryDialogOpen(true)}  // Si no hay categorias se abre el dialogo de edición de categoría <CategoryFormDialog /> -> permite crear una nueva categoría
      />
    )
  }

  return (
    <div className='grid grid-cols-4 gap-2'>
      {categoriesQuery.isLoading ? (
        <CategoryCardsSkeleton />
      ) : (
        <>
          {categoriesQuery.data?.map((item) => (
            <div key={item.id} className='bg-accent flex flex-col justify-between gap-3 rounded-lg p-6 shadow-md'>
              <p className='truncate'>
                {item.name}
              </p>
              <div className='flex gap-1'>
                <Button 
                  className='size-6' 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => {
                    updateSelectedCategoryId(item.id);  // Establece el ID de la categoría seleccionada -> useCategory(selectedCategoryId) se activa  -> getCategory -> establece action="update". Ademas en CategoryFormDialog acticva el useEffect para cargar el valor existente de la categoría
                    updateCategoryDialogOpen(true);     // Abre el dialogo de edición de categoría <CategoryFormDialog /> -> permite cambiar el nombre de la categoría
                  }}
                >
                  <Edit />
                </Button>
                <Button 
                  className='size-6' 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => {
                    alert({
                      title: "Delete Category",
                      description: "Are you sure you want to delete this category?",
                      confirmLabel: "Delete",
                      cancelLabel: "Cancel",
                      onConfirm: () => deleteCategoryMutation.mutate(item.id),
                    })
                  }}>
                  <Trash />
                </Button>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  )
}

export default CategoryCards