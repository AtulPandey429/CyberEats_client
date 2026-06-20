'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { PageHeader } from '@/components/layout/PageHeader';
import { PageShell } from '@/components/layout/PageShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RequireAuth } from '@/components/RequireAuth';
import { useCart, useExchangeRate } from '@/features/cart/useCart';
import { WalletPayButton } from '@/features/checkout/WalletPayButton';
import { PaymentStatusOverlay } from '@/features/checkout/PaymentStatusOverlay';
import { api } from '@/services/api';
import { formatUsd } from '@/lib/utils';
import { useToast } from '@/providers/ToastProvider';

const SURCHARGE = 2.99;
const GAS = 0.01;

const emptyCart = { restaurantId: null, items: [] };

function paymentFailureMessage(reason: string | null): string {
  if (reason?.includes('mismatch') || reason === 'payment-mismatch') {
    return 'Payment failed — amount or merchant address did not match the order.';
  }
  if (reason === 'tx-not-found') {
    return 'Payment failed — transaction was not found on the network.';
  }
  if (reason === 'merchant-xrp-not-configured') {
    return 'Set MERCHANT_XRP_ADDRESS in backend .env to your XRPL testnet r-address.';
  }
  return 'Payment verification failed. Try mock payment for local testing.';
}

function CheckoutContent() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { cartQuery, subtotal, itemCount } = useCart();
  const rateQuery = useExchangeRate();
  const [address, setAddress] = useState('Neo-Tokyo Sector 7, Block 42');
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderTotals, setOrderTotals] = useState<{ totalXlm: number; totalXrp: number } | null>(
    null,
  );
  const [paymentOverlay, setPaymentOverlay] = useState<{
    open: boolean;
    message: string;
    detail?: string;
  }>({ open: false, message: '' });
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  useEffect(() => () => stopPolling(), [stopPolling]);

  const createOrder = useMutation({
    mutationFn: async () => {
      const { data } = await api.post('/orders', {
        deliveryAddress: {
          formatted: address,
          coordinates: [139.767, 35.6812],
        },
      });
      return data.data as {
        _id: string;
        pricingSnapshot: { totalXlm: number; totalXrp: number; totalUsd: number };
      };
    },
    onSuccess: (order) => {
      setOrderId(order._id);
      setOrderTotals({
        totalXlm: order.pricingSnapshot.totalXlm,
        totalXrp: order.pricingSnapshot.totalXrp,
      });
    },
  });

  const startPaymentVerification = useCallback(
    (paymentId: string) => {
      stopPolling();
      setPaymentOverlay({
        open: true,
        message: 'Verifying payment…',
        detail: 'Confirming your transaction on the network. This may take a few seconds.',
      });

      pollRef.current = setInterval(async () => {
        try {
          const { data } = await api.get(`/checkout/pay/${paymentId}/status`);
          const paymentStatus = data.data.payment.paymentStatus as string;
          const reason = data.data.payment.failureReason as string | null;

          if (paymentStatus === 'CONFIRMED') {
            stopPolling();
            queryClient.setQueryData(['cart'], emptyCart);
            toast('Payment confirmed! Your order is being prepared.');
            router.replace(`/orders/${orderId}`);
            return;
          }

          if (paymentStatus === 'FAILED') {
            stopPolling();
            setPaymentOverlay({ open: false, message: '' });
            toast(paymentFailureMessage(reason), 'error');
          }
        } catch {
          stopPolling();
          setPaymentOverlay({ open: false, message: '' });
          toast('Could not verify payment status. Check your orders page.', 'error');
        }
      }, 2000);
    },
    [orderId, queryClient, router, stopPolling, toast],
  );

  const totalUsd = subtotal + SURCHARGE + GAS;
  const xlmRate = rateQuery.data?.xlm.rate ?? 0.124;
  const xrpRate = rateQuery.data?.xrp.rate ?? 2.5;
  const totalXlm = xlmRate > 0 ? totalUsd / xlmRate : 0;
  const totalXrp = xrpRate > 0 ? totalUsd / xrpRate : 0;

  const overlayOpen =
    paymentOverlay.open || createOrder.isPending;

  const overlayMessage = createOrder.isPending
    ? 'Creating your order…'
    : paymentOverlay.message;

  const overlayDetail = createOrder.isPending
    ? 'Please wait while we prepare checkout.'
    : paymentOverlay.detail;

  if (cartQuery.isLoading) return <LoadingSpinner label="Loading cart..." />;

  if (itemCount === 0 && !orderId) {
    return (
      <p className="terminal-panel rounded-xl p-6 text-center text-muted">
        Your cart is empty.
      </p>
    );
  }

  return (
    <>
      <PaymentStatusOverlay
        open={overlayOpen}
        message={overlayMessage}
        detail={overlayDetail}
      />

      <div className="mx-auto max-w-3xl space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="terminal-panel border-theme">
            <CardHeader>
              <CardTitle className="text-base uppercase tracking-[0.18em]">
                Delivery coordinates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <label className="section-label mb-2 block" htmlFor="delivery-address">
                Drop zone
              </label>
              <Input
                id="delivery-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                disabled={Boolean(orderId) || overlayOpen}
              />
            </CardContent>
          </Card>

          <Card className="terminal-panel border-theme">
            <CardHeader>
              <CardTitle className="text-base uppercase tracking-[0.18em]">Order summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Subtotal</span>
                <span>{formatUsd(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Surcharge</span>
                <span>{formatUsd(SURCHARGE)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Network fee</span>
                <span>{formatUsd(GAS)}</span>
              </div>
              <div className="flex justify-between border-t border-theme pt-2 font-semibold">
                <span>Total</span>
                <span className="text-accent">{formatUsd(totalUsd)}</span>
              </div>
              <p className="text-xs text-muted">
                ~{totalXrp.toFixed(4)} XRP (Gem) · ~{totalXlm.toFixed(7)} XLM (Freighter)
              </p>
              <p className="text-xs text-muted">
                1 XRP ≈ {formatUsd(xrpRate)} · 1 XLM ≈ {formatUsd(xlmRate)}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="terminal-panel border-theme">
          <CardHeader>
            <CardTitle className="text-base uppercase tracking-[0.18em]">
              {orderId ? 'Payment' : 'Confirm order'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!orderId ? (
              <Button
                type="button"
                size="lg"
                className="w-full cyber-glow"
                disabled={createOrder.isPending}
                onClick={() => createOrder.mutate()}
              >
                {createOrder.isPending ? 'Creating order…' : 'Place order'}
              </Button>
            ) : (
              <WalletPayButton
                orderId={orderId}
                totalXlm={orderTotals?.totalXlm ?? totalXlm}
                totalXrp={orderTotals?.totalXrp ?? totalXrp}
                disabled={overlayOpen}
                onPaymentStart={(message) =>
                  setPaymentOverlay({
                    open: true,
                    message,
                    detail: 'Complete the approval in your wallet if prompted.',
                  })
                }
                onPaymentError={() => setPaymentOverlay({ open: false, message: '' })}
                onPaid={startPaymentVerification}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default function CheckoutPage() {
  return (
    <RequireAuth>
      <PageShell compact>
        <PageHeader
          status="Payment · Gem (XRP) or Freighter (XLM) testnet"
          title="Checkout"
          subtitle="Confirm delivery coordinates and pay with Gem Wallet or Freighter."
        />
        <CheckoutContent />
      </PageShell>
    </RequireAuth>
  );
}
