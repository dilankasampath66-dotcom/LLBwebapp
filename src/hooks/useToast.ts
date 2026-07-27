'use client';

import { useToastContext, ToastType } from '@/components/providers/ToastProvider';

export function useToast() {
  const { toasts, addToast, removeToast } = useToastContext();

  const toast = (
    messageOrOptions: string | { message?: string; title?: string; type?: ToastType; variant?: ToastType },
    typeParam?: ToastType
  ) => {
    if (typeof messageOrOptions === 'string') {
      addToast(messageOrOptions, typeParam || 'info');
    } else if (messageOrOptions && typeof messageOrOptions === 'object') {
      const msg = messageOrOptions.message || messageOrOptions.title || '';
      const t = messageOrOptions.type || messageOrOptions.variant || 'info';
      addToast(msg, t);
    }
  };

  return {
    toasts,
    toast,
    addToast,
    removeToast,
  };
}
