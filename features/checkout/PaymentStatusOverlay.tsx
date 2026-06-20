'use client';

import { LoadingSpinner } from '@/components/LoadingSpinner';

interface PaymentStatusOverlayProps {
  open: boolean;
  message: string;
  detail?: string;
}

export function PaymentStatusOverlay({ open, message, detail }: PaymentStatusOverlayProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[var(--overlay)] px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-status-title"
    >
      <div className="terminal-panel w-full max-w-sm rounded-2xl p-8 text-center">
        <LoadingSpinner label={message} />
        {detail && (
          <p id="payment-status-title" className="mt-4 text-xs text-muted">
            {detail}
          </p>
        )}
      </div>
    </div>
  );
}
