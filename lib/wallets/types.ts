export type WalletProvider = 'freighter' | 'gem';

export interface WalletProviderMeta {
  id: WalletProvider;
  name: string;
  chain: string;
  asset: string;
  description: string;
}

/** Matches personal project wallet provider labels (Gem = XRP, Freighter = Stellar). */
export const WALLET_PROVIDERS: WalletProviderMeta[] = [
  {
    id: 'gem',
    name: 'Gem Wallet',
    chain: 'XRP Ledger',
    asset: 'XRP',
    description: 'Pay with XRP on XRPL',
  },
  {
    id: 'freighter',
    name: 'Freighter',
    chain: 'Stellar',
    asset: 'XLM',
    description: 'Pay with XLM on Stellar testnet',
  },
];

export function getWalletProvider(id: WalletProvider): WalletProviderMeta | undefined {
  return WALLET_PROVIDERS.find((provider) => provider.id === id);
}

export interface WalletDetectionResult {
  freighterInstalled: boolean;
  gemInstalled: boolean;
}
