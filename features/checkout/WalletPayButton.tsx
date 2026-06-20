'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { api } from '@/services/api';
import { useToast } from '@/providers/ToastProvider';
import {
  detectAvailableWallets,
  getWalletProvider,
  WALLET_PROVIDERS,
  type WalletProvider,
} from '@/lib/wallets';

interface WalletPayButtonProps {
  orderId: string;
  totalXlm: number;
  totalXrp: number;
  disabled?: boolean;
  onPaymentStart?: (message: string) => void;
  onPaymentError?: () => void;
  onPaid: (paymentId: string) => void;
}

export function WalletPayButton({
  orderId,
  totalXlm,
  totalXrp,
  disabled = false,
  onPaymentStart,
  onPaymentError,
  onPaid,
}: WalletPayButtonProps) {
  const { toast } = useToast();
  const [freighterInstalled, setFreighterInstalled] = useState(false);
  const [gemInstalled, setGemInstalled] = useState(false);
  const [detecting, setDetecting] = useState(true);
  const [provider, setProvider] = useState<WalletProvider>('freighter');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    detectAvailableWallets().then((result) => {
      if (!active) return;
      setFreighterInstalled(result.freighterInstalled);
      setGemInstalled(result.gemInstalled);
      if (result.gemInstalled && !result.freighterInstalled) setProvider('gem');
      else if (result.freighterInstalled) setProvider('freighter');
      else if (result.gemInstalled) setProvider('gem');
      setDetecting(false);
    });
    return () => {
      active = false;
    };
  }, []);

  async function submitPayment(txHash: string, walletProvider: WalletProvider) {
    onPaymentStart?.('Submitting payment…');
    setStatus('Submitting payment…');
    const { data } = await api.post('/checkout/pay', { orderId, txHash, walletProvider });
    onPaymentStart?.('Verifying payment…');
    setStatus('Verifying payment…');
    onPaid(data.data.paymentId);
  }

  async function payWithWallet() {
    const meta = getWalletProvider(provider);
    const installed = provider === 'freighter' ? freighterInstalled : gemInstalled;
    if (!installed) {
      toast(`${meta?.name ?? provider} is not installed.`, 'error');
      return;
    }

    setLoading(true);
    onPaymentStart?.('Loading payment details…');
    setStatus('Loading payment details…');
    try {
      const { data: configRes } = await api.get('/checkout/payment-config');
      const config = configRes.data as {
        stellar: {
          merchantAddress: string;
          networkPassphrase: string;
          horizonUrl: string;
        };
        xrp: { merchantAddress: string; network: string };
      };

      if (provider === 'gem') {
        onPaymentStart?.('Approve payment in Gem Wallet…');
        setStatus('Approve the XRP payment in Gem Wallet…');
        const { payWithGemWallet } = await import('@/lib/xrp-payment');
        const txHash = await payWithGemWallet({
          amountXrp: totalXrp,
          merchantAddress: config.xrp.merchantAddress,
        });
        await submitPayment(txHash, 'gem');
      } else {
        onPaymentStart?.('Approve payment in Freighter…');
        setStatus('Approve the payment in Freighter…');
        const { payWithStellarWallet } = await import('@/lib/stellar-payment');
        const txHash = await payWithStellarWallet({
          provider: 'freighter',
          amountXlm: totalXlm,
          merchantAddress: config.stellar.merchantAddress,
          networkPassphrase: config.stellar.networkPassphrase,
          horizonUrl: config.stellar.horizonUrl,
        });
        await submitPayment(txHash, 'freighter');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Payment failed';
      toast(message, 'error');
      onPaymentError?.();
      setLoading(false);
      setStatus(null);
    }
  }

  async function payWithMock() {
    setLoading(true);
    try {
      await submitPayment(`mock-tx-${Date.now()}`, provider);
    } catch {
      toast('Mock payment failed', 'error');
      onPaymentError?.();
      setLoading(false);
      setStatus(null);
    }
  }

  const installed = provider === 'freighter' ? freighterInstalled : gemInstalled;
  const payLabel =
    provider === 'gem'
      ? `Pay with Gem (${totalXrp.toFixed(4)} XRP)`
      : `Pay with Freighter (${totalXlm.toFixed(7)} XLM)`;

  const busy = loading || disabled;

  return (
    <div className="space-y-4">
      {loading && status && (
        <div className="flex items-center gap-3 rounded-lg border border-theme bg-accent-soft px-3 py-2">
          <div
            className="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-theme border-t-accent"
            aria-hidden
          />
          <p className="text-sm text-accent">{status}</p>
        </div>
      )}

      <p className="text-sm text-muted">
        Pay{' '}
        <span className="font-semibold text-emerald-300">~{totalXrp.toFixed(4)} XRP</span>
        {' or '}
        <span className="font-semibold text-accent">~{totalXlm.toFixed(7)} XLM</span>
      </p>

      {detecting ? (
        <p className="text-xs text-muted">Detecting wallets…</p>
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            {WALLET_PROVIDERS.map((wallet) => {
              const isInstalled = wallet.id === 'freighter' ? freighterInstalled : gemInstalled;
              return (
                <Button
                  key={wallet.id}
                  type="button"
                  size="sm"
                  variant={provider === wallet.id ? 'default' : 'outline'}
                  onClick={() => setProvider(wallet.id)}
                  disabled={busy || !isInstalled}
                  title={
                    isInstalled
                      ? `${wallet.chain} · ${wallet.asset}`
                      : `${wallet.name} not installed`
                  }
                >
                  {wallet.name}
                  {!isInstalled && <span className="ml-1 text-muted">(not installed)</span>}
                </Button>
              );
            })}
          </div>

          {!freighterInstalled && !gemInstalled && (
            <p className="rounded-lg border border-amber-400/25 bg-amber-400/5 px-3 py-2 text-xs text-amber-200/90">
              Install{' '}
              <a
                href="https://gemwallet.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-300 underline"
              >
                Gem Wallet
              </a>{' '}
              (XRP) or{' '}
              <a
                href="https://www.freighter.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline"
              >
                Freighter
              </a>{' '}
              (XLM), or use mock payment below.
            </p>
          )}

          {provider === 'gem' && gemInstalled && (
            <p className="text-xs text-muted">
              {getWalletProvider('gem')?.description}. Use XRPL testnet in Gem and fund from the{' '}
              <a
                href="https://xrpl.org/resources/aliases/xrp-testnet-faucet"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-300 underline"
              >
                XRP testnet faucet
              </a>
              .
            </p>
          )}
        </>
      )}

      <Button
        type="button"
        className="w-full cyber-glow"
        disabled={busy || detecting || !installed}
        onClick={payWithWallet}
      >
        {loading ? status ?? 'Processing…' : payLabel}
      </Button>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled={busy}
        onClick={payWithMock}
      >
        {loading ? 'Processing…' : 'Mock payment (dev only)'}
      </Button>

      <p className="text-xs text-muted">
        Gem = XRP on XRPL testnet. Freighter = XLM on Stellar testnet. Gem needs 2 popups (connect +
        sign).
      </p>
    </div>
  );
}
