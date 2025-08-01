import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useGlobalStore } from "@/lib/use-global-store";

/**
 * Proveedor global para los diálogos de alerta.
 * Este componente debe ser renderizado una sola vez en la aplicación (ej. en `providers.tsx`).
 * Escucha al `useGlobalStore` para mostrar un diálogo de alerta configurado dinámicamente
 * desde cualquier parte de la aplicación sin necesidad de anidar componentes de diálogo.
 */
const AlertDialogProvider = () => {
  
  const { 
    alertOpen,                 // booleano que le dice si debe mostrarse o no.                
    alertConfig,               // Un objeto que contiene toda la información para renderizar el diálogo (título, descripción, texto de los botones y, lo más importante, las funciones onConfirm y onCancel que se deben ejecutar). 
    updateAlertOpen            // La acción que utiliza para cerrarse a sí mismo.
  } = useGlobalStore();          

  /**
   * Maneja la acción de confirmación.
   * Ejecuta el callback `onConfirm` si existe y luego cierra el diálogo.
   */
  const handleConfirm = () => {
    if (alertConfig?.onConfirm) {
      alertConfig.onConfirm();
    }
    updateAlertOpen(false);
  };

  /**
   * Maneja la acción de cancelación.
   * Ejecuta el callback `onCancel` si existe y luego cierra el diálogo.
   */
  const handleCancel = () => {
    if (alertConfig?.onCancel) {
      alertConfig.onCancel();
    }
    updateAlertOpen(false);
  };

  // Si no hay configuración de alerta, no se renderiza nada para mantener el DOM limpio.
  if (!alertConfig) return null;

  return (
    // El componente AlertDialog de Radix/shadcn se controla mediante el estado del store.
    <AlertDialog open={alertOpen} onOpenChange={updateAlertOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          {/* Usa los textos de la configuración o valores por defecto. */}
          <AlertDialogTitle>
            {alertConfig.title || "Confirmation Required"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {alertConfig.description || "Are you sure you want to perform this action?"}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {/* Asigna los manejadores de eventos a los botones de acción. */}
          <AlertDialogCancel onClick={handleCancel}>
            {alertConfig.cancelLabel || "Cancel"}
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>
            {alertConfig.confirmLabel || "Continue"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export { AlertDialogProvider };