'use client';

import { sendGemPayment } from '@/lib/wallets/gem-wallet';

export interface PayWithGemInput {
  amountXrp: number;
  merchantAddress: string;
}

export async function payWithGemWallet(input: PayWithGemInput): Promise<string> {
  if (!input.merchantAddress || input.merchantAddress.startsWith('r...')) {
    throw new Error(
      'Merchant XRP address is not configured on the server — set MERCHANT_XRP_ADDRESS in backend .env',
    );
  }

  return sendGemPayment({
    destination: input.merchantAddress,
    amountXrp: input.amountXrp,
  });
}
