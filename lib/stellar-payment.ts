'use client';

import {
  Asset,
  BASE_FEE,
  Horizon,
  Operation,
  TransactionBuilder,
} from '@stellar/stellar-sdk';
import {
  connectFreighterWallet,
  signFreighterTransaction,
  canPayWithStellar,
} from '@/lib/wallets';
import type { WalletProvider } from '@/lib/wallets';

export interface StellarPaymentConfig {
  merchantAddress: string;
  networkPassphrase: string;
  horizonUrl: string;
}

export interface PayWithWalletInput extends StellarPaymentConfig {
  amountXlm: number;
  provider: WalletProvider;
}

function formatXlmAmount(amountXlm: number): string {
  return amountXlm.toFixed(7);
}

export async function payWithStellarWallet(input: PayWithWalletInput): Promise<string> {
  if (!canPayWithStellar(input.provider)) {
    throw new Error(
      'Gem Wallet browser extension supports XRP Ledger only. Install Freighter for Stellar (XLM) payments.',
    );
  }

  const { address: sourceAddress } = await connectFreighterWallet();
  const amount = formatXlmAmount(input.amountXlm);
  const server = new Horizon.Server(input.horizonUrl);

  let sourceAccount;
  try {
    sourceAccount = await server.loadAccount(sourceAddress);
  } catch {
    throw new Error(
      'Your Stellar account is not funded on testnet — get free XLM from the Stellar testnet faucet first',
    );
  }

  const transaction = new TransactionBuilder(sourceAccount, {
    fee: BASE_FEE,
    networkPassphrase: input.networkPassphrase,
  })
    .addOperation(
      Operation.payment({
        destination: input.merchantAddress,
        asset: Asset.native(),
        amount,
      }),
    )
    .setTimeout(180)
    .build();

  const signedXdr = await signFreighterTransaction(
    transaction.toXDR(),
    input.networkPassphrase,
    sourceAddress,
  );

  const signedTx = TransactionBuilder.fromXDR(signedXdr, input.networkPassphrase);
  const result = await server.submitTransaction(signedTx);
  return result.hash;
}
