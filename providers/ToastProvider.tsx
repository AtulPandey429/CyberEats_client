'use client';

import {
  Toast,
  ToastCloseButton,
  ToastProvider as RadixToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast';
import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

type ToastVariant = 'success' | 'error';

interface ToastItem {
  id: string;
  title: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  toast: (title: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function AppToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback((title: string, variant: ToastVariant = 'success') => {
    setToasts((current) => [...current, { id: crypto.randomUUID(), title, variant }]);
  }, []);

  const dismiss = (id: string) => {
    setToasts((current) => current.filter((item) => item.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      <RadixToastProvider>
        {children}
        {toasts.map((item) => (
          <Toast
            key={item.id}
            open
            onOpenChange={(open) => {
              if (!open) dismiss(item.id);
            }}
            className={item.variant === 'error' ? 'border-red-400/40' : undefined}
          >
            <ToastTitle>{item.title}</ToastTitle>
            <ToastCloseButton />
          </Toast>
        ))}
        <ToastViewport />
      </RadixToastProvider>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within AppToastProvider');
  }
  return context;
}
