'use client';

import { useState } from 'react';
import Image from 'next/image';
import { api } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function TwoFactorSetup() {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  const startSetup = async () => {
    const { data } = await api.post('/auth/2fa/setup');
    setQrCode(data.data.qrCodeDataUrl);
    setSecret(data.data.secret);
    setStatus('Scan QR in authenticator app, then enter code.');
  };

  const verify = async () => {
    await api.post('/auth/2fa/verify', { totpCode: code });
    setStatus('2FA enabled.');
  };

  return (
    <div className="space-y-3 rounded-xl border border-theme bg-input/60 p-4">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-accent">
        Two-Factor Auth
      </h3>
      <Button type="button" onClick={startSetup}>
        Setup 2FA
      </Button>
      {qrCode && (
        <Image src={qrCode} alt="2FA QR code" width={180} height={180} className="rounded" />
      )}
      {secret && <p className="text-xs text-muted">Secret: {secret}</p>}
      {qrCode && (
        <>
          <Input
            placeholder="6-digit code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <Button type="button" onClick={verify} disabled={code.length !== 6}>
            Enable 2FA
          </Button>
        </>
      )}
      {status && <p className="text-sm text-muted">{status}</p>}
    </div>
  );
}
