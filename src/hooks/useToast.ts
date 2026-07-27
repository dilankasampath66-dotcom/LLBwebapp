import { useToastContext } from '@/components/providers/ToastProvider';

export function useToast() {
  const { toasts, addToast, removeToast } = useToastContext();
  
  return {
    toasts,
    toast: addToast,
    removeToast,
  };
}
