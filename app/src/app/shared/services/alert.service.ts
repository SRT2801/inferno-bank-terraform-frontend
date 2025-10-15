import { Injectable } from '@angular/core';
import { toast } from 'ngx-sonner';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  success(message: string, description?: string) {
    toast.success(message, {
      description,
      duration: 3000,
    });
  }

  error(message: string, description?: string) {
    toast.error(message, {
      description,
      duration: 5000,
    });
  }

  info(message: string, description?: string) {
    toast.info(message, {
      description,
      duration: 3000,
    });
  }

  warning(message: string, description?: string) {
    toast.warning(message, {
      description,
      duration: 4000,
    });
  }

  loading(message: string) {
    return toast.loading(message);
  }

  promise<T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) {
    return toast.promise(promise, messages);
  }

  confirm(message: string, description: string, onConfirm: () => void, onCancel?: () => void) {
    toast.warning(message, {
      description,
      duration: Infinity, 
      action: {
        label: 'Aceptar',
        onClick: () => {
          onConfirm();
        },
      },
      cancel: {
        label: 'Cancelar',
        onClick: () => {
          if (onCancel) onCancel();
        },
      },
    });
  }

  dismiss(toastId?: string | number) {
    toast.dismiss(toastId);
  }
}
