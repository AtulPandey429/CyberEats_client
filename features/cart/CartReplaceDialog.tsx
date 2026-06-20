'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface CartReplaceDialogProps {
  open: boolean;
  itemName?: string;
  isPending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function CartReplaceDialog({
  open,
  itemName,
  isPending,
  onConfirm,
  onCancel,
}: CartReplaceDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onCancel()}>
      <DialogContent className="glass-panel border-theme">
        <DialogHeader>
          <DialogTitle className="uppercase tracking-[0.14em] text-white">
            Replace cart?
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm leading-relaxed text-muted">
          Your cart already has items from another restaurant. Clear it and add{' '}
          <span className="text-accent">{itemName ?? 'this item'}</span> instead?
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
            Keep current cart
          </Button>
          <Button type="button" className="cyber-glow" onClick={onConfirm} disabled={isPending}>
            {isPending ? 'Updating…' : 'Replace cart'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
