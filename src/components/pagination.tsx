import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from "lucide-react";
import { useEffect, useRef } from "react";

// Definición de las propiedades que el componente Pagination puede recibir.
type PaginationProps = {
  currentPage: number;
  totalPages: number | undefined;
  updatePage: (action: "next" | "prev" | number) => void;
  className?: string;
  scrollToTopOnPaginate?: boolean;
};

// Componente de paginación reutilizable.
const Pagination = ({
  currentPage,                                                                        // Página actual.
  totalPages,                                                                         // Número total de páginas.
  updatePage,                                                                         // Función para actualizar la página.
  className,
  scrollToTopOnPaginate = true,
}: PaginationProps) => {
  
  const prevPageRef = useRef(currentPage);                                             // Usamos una referencia para almacenar la página anterior y detectar cambios.                         

  
  useEffect(() => {                                                                    // useEffect para manejar el desplazamiento al principio de la página cuando se cambia de página.    
    if (scrollToTopOnPaginate && prevPageRef.current !== currentPage) {                // Si la opción está activada y la página ha cambiado...
      window.scrollTo({                                                                // Se desplaza al principio de la página.
        top: 0,
        behavior: "smooth",
      });
    }
    prevPageRef.current = currentPage;                                                 // Se actualiza la referencia para detectar cambios en la página actual.
  }, [currentPage, scrollToTopOnPaginate]);                                            // Se ejecuta cada vez que currentPage o scrollToTopOnPaginate cambian.

  
  if (totalPages === undefined) {                                                      // Si `totalPages` es undefined, se asume que los datos están cargando y se muestra un esqueleto.
    return ( 
      // Contenedor para el esqueleto de paginación.
      <div className="flex justify-center">                                             
        <div className="flex items-center gap-1">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
    );
  }

  
  const generatePagination = () => {                                                  // Función para generar la lógica de los números de página a mostrar.
    
    const pages: (number | "ellipsis")[] = [];                                        // Creamos un array vacío para almacenar los números de página.

    if (totalPages <= 7) {                                                            // Si el total de páginas es 7 o menos, se muestran todos los números.
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {                                                                          // Si hay más de 7 páginas, se aplica una lógica más compleja.
      
      pages.push(1);
  
      if (currentPage > 3) {                                                          // Muestra "..." al principio si la página actual está lejos del inicio.
        pages.push("ellipsis");
      }

      const startPage = Math.max(2, currentPage - 1);                                 // Define el rango de páginas a mostrar alrededor de la página actual.
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {                                    // Añade las páginas del rango.
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {                                             // Muestra "..." al final si la página actual está lejos del final.   
        pages.push("ellipsis");
      }

      if (totalPages > 1) {                                                           // Siempre muestra la última página si hay más de una.
        pages.push(totalPages);
      }
    }

    return pages;
  };

  // Genera el array de páginas a renderizar.
  const pages = generatePagination();

  // Manejador para actualizar la página, invoca la función `updatePage` pasada por props.
  const handlePageUpdate = (pageAction: "next" | "prev" | number) => {
    updatePage(pageAction);
  };

  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
    >
      <ul className="flex flex-row items-center gap-1">
        {/* Botón para ir a la página anterior */}
        <li>
          <button
            onClick={() => handlePageUpdate("prev")}
            disabled={currentPage === 1}
            aria-label="Go to previous page"
            className={cn(
              buttonVariants({
                variant: "ghost",
                size: "default",
              }),
              "gap-1 px-2.5 sm:pl-2.5",
              currentPage === 1 && "pointer-events-none opacity-50",
            )}
          >
            <ChevronLeftIcon />
            <span className="hidden sm:block">Previous</span>
          </button>
        </li>

        {/* Mapea el array de páginas para renderizar los botones de número o la elipsis */}
        {pages.map((page, i) => (
          <li key={`${page}-${i}`} data-slot="pagination-item">
            {page === "ellipsis" ? (
              <span
                aria-hidden
                data-slot="pagination-ellipsis"
                className="flex size-9 items-center justify-center"
              >
                <MoreHorizontalIcon className="size-4" />
                <span className="sr-only">More pages</span>
              </span>
            ) : (
              // Botón para un número de página específico.
              <button
                onClick={() => handlePageUpdate(page)}
                aria-current={currentPage === page ? "page" : undefined}
                data-active={currentPage === page}
                className={cn(
                  buttonVariants({
                    variant: currentPage === page ? "outline" : "ghost",
                    size: "icon",
                  }),
                )}
              >
                {page}
              </button>
            )}
          </li>
        ))}

        {/* Botón para ir a la página siguiente */}
        <li>
          <button
            onClick={() => handlePageUpdate("next")}
            disabled={currentPage === totalPages}
            aria-label="Go to next page"
            className={cn(
              buttonVariants({
                variant: "ghost",
                size: "default",
              }),
              "gap-1 px-2.5 sm:pr-2.5",
              currentPage === totalPages && "pointer-events-none opacity-50",
            )}
          >
            <span className="hidden sm:block">Next</span>
            <ChevronRightIcon />
          </button>
        </li>
      </ul>
    </nav>
  );
};

export { Pagination };