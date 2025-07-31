"use client"

import React from 'react'
import { useCategories } from '../_services/use-category-queries'
import { useDeleteCategory } from '../_services/use-category-mutations';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';

const CategoryCards = () => {

  const categoriesQuery = useCategories();              // Query para obtener los datos de las categorías
  const deleteCategoryMutation = useDeleteCategory();   // Mutación para eliminar una categoría


  return (
    <div className='grid grid-cols-4 gap-2'>
      {categoriesQuery.data?.map((item) => (
        <div key={item.id} className='bg-accent flex flex-col justify-between gap-3 rounded-lg p-6 shadow-md'>
          <p className='truncate'>
            {item.name}
          </p>
          <div className='flex gap-1'>
            <Button className='size-6' variant="ghost" size="icon" onClick={() => {}}>
              <Edit />
            </Button>
            <Button className='size-6' variant="ghost" size="icon" onClick={() => deleteCategoryMutation.mutate(item.id)}>
              <Trash />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default CategoryCards