import { useQuery } from "@tanstack/react-query";
import { getCategories, getCategory } from "./categoryQueries";
import { useCategoriesStore } from "../_libs/useCategoriesStore";



const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
};

const useCategory = () => {
  const { selectedCategoryId } = useCategoriesStore();

  return useQuery({
    queryKey: ["categories", { selectedCategoryId }],
    queryFn: () => getCategory(selectedCategoryId as number),
    enabled: selectedCategoryId !== null,
  });
};

export { useCategories, useCategory };