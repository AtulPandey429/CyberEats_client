'use client';

import { useState } from 'react';
import { api } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  connectWallet,
  signWalletMessage,
  type WalletProvider,
} from '@/lib/stellar-wallets';

interface WalletLinkButtonProps {
  onLinked?: () => void;
}

export function WalletLinkButton({ onLinked }: WalletLinkButtonProps) {
  const [provider, setProvider] = useState<WalletProvider>('freighter');
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const linkWithWallet = async () => {
    setLoading(true);
    setStatus(null);
    setMessage('');

    try {
      const walletAddress = await connectWallet(provider);
      setAddress(walletAddress);

      const { data } = await api.post('/auth/wallet/challenge', { address: walletAddress });
      const challengeMessage = data.data.message as string;
      setMessage(challengeMessage);

      const signature = await signWalletMessage(provider, challengeMessage, walletAddress);
      await api.post('/auth/wallet/verify', {
        address: walletAddress,
        message: challengeMessage,
        signature,
        walletProvider: provider,
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
    <div className="space-y-3 rounded-xl border border-cyan-400/20 bg-slate-900/60 p-4">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-cyan-300">
        Link Stellar Wallet
      </h3>

      <div className="flex gap-2">
        <Button
          type="button"
          variant={provider === 'freighter' ? 'default' : 'outline'}
          onClick={() => setProvider('freighter')}
        >
          Freighter
        </Button>
        <Button
          type="button"
          variant={provider === 'gem' ? 'default' : 'outline'}
          onClick={() => setProvider('gem')}
        >
          Gem (SEP-0043)
        </Button>
      </div>

      <Button type="button" onClick={() => void linkWithWallet()} disabled={loading}>
        {loading ? 'Connecting...' : `Connect ${provider === 'freighter' ? 'Freighter' : 'Gem'}`}
      </Button>

      {address && <p className="font-mono text-xs text-cyan-300">{address}</p>}

      {message && (
        <pre className="overflow-x-auto rounded bg-black/40 p-3 text-xs text-slate-300">
          {message}
        </pre>
      )}

      {status && <p className="text-sm text-slate-400">{status}</p>}

      <details className="text-xs text-slate-500">
        <summary className="cursor-pointer text-slate-400">Manual fallback</summary>
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
                setStatus('Sign the message in your wallet, then paste the signature below.');
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
                    walletProvider: provider,
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
