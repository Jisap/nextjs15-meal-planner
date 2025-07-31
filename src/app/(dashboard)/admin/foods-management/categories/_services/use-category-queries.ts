import { useQuery } from "@tanstack/react-query";
import { getCategories } from "./categoryQueries";



const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
};

export { useCategories };