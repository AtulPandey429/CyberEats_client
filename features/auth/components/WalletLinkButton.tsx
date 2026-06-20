'use client';

import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { connectWallet, detectAvailableWallets, signWalletMessage } from '@/lib/wallets';

interface WalletLinkButtonProps {
  onLinked?: () => void;
}

export function WalletLinkButton({ onLinked }: WalletLinkButtonProps) {
  const [freighterInstalled, setFreighterInstalled] = useState(false);
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    detectAvailableWallets().then((result) => {
      setFreighterInstalled(result.freighterInstalled);
    });
  }, []);

  const linkWithWallet = async () => {
    setLoading(true);
    setStatus(null);
    setMessage('');

    try {
      const walletAddress = await connectWallet('freighter');
      setAddress(walletAddress);

      const { data } = await api.post('/auth/wallet/challenge', { address: walletAddress });
      const challengeMessage = data.data.message as string;
      setMessage(challengeMessage);

      const signature = await signWalletMessage('freighter', challengeMessage, walletAddress);
      await api.post('/auth/wallet/verify', {
        address: walletAddress,
        message: challengeMessage,
        signature,
        walletProvider: 'freighter',
      });

      setStatus('Wallet linked successfully.');
      onLinked?.();
    } catch (err) {
      const detail = err instanceof Error ? err.message : 'Wallet linking failed.';
      setStatus(detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3 rounded-xl border border-theme bg-input/60 p-4">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-accent">
        Link Stellar Wallet
      </h3>

      <p className="text-xs text-muted">
        Connect Freighter to link a Stellar (G…) address to your account.
      </p>

      {!freighterInstalled && (
        <p className="rounded-lg border border-amber-400/20 bg-amber-400/5 px-3 py-2 text-xs text-amber-200/90">
          Freighter is not installed.{' '}
          <a
            href="https://www.freighter.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline hover:text-accent"
          >
            Install Freighter
          </a>{' '}
          or use manual fallback below.
        </p>
      )}

      <Button
        type="button"
        onClick={() => void linkWithWallet()}
        disabled={loading || !freighterInstalled}
      >
        {loading ? 'Connecting…' : 'Connect Freighter'}
      </Button>

      {address && <p className="font-mono text-xs text-accent">{address}</p>}

      {message && (
        <pre className="overflow-x-auto rounded bg-surface-elevated p-3 text-xs text-foreground/80">
          {message}
        </pre>
      )}

      {status && <p className="text-sm text-muted">{status}</p>}

      <details className="text-xs text-muted">
        <summary className="cursor-pointer text-muted">Manual fallback</summary>
        <div className="mt-2 space-y-2">
          <Input
            placeholder="Stellar address (G...)"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <Button
            type="button"
            variant="outline"
            disabled={loading || !address}
            onClick={async () => {
              setLoading(true);
              try {
                const { data } = await api.post('/auth/wallet/challenge', { address });
                setMessage(data.data.message);
                setStatus('Sign the message in Freighter, then paste the signature below.');
              } catch {
                setStatus('Failed to create wallet challenge.');
              } finally {
                setLoading(false);
              }
            }}
          >
            Get challenge
          </Button>
          {message && (
            <Input
              placeholder="Paste base64 signature"
              onBlur={async (e) => {
                if (!e.target.value) return;
                setLoading(true);
                try {
                  await api.post('/auth/wallet/verify', {
                    address,
                    message,
                    signature: e.target.value,
                    walletProvider: 'freighter',
                  });
                  setStatus('Wallet linked successfully.');
                  onLinked?.();
                } catch {
                  setStatus('Wallet verification failed.');
                } finally {
                  setLoading(false);
                }
              }}
            />
          )}
        </div>
      </details>
    </div>
  );
}
