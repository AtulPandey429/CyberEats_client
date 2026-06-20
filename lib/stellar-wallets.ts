/** @deprecated Import from `@/lib/wallets` instead. Kept for existing imports. */
export {
  connectWallet,
  detectAvailableWallets,
  signWalletMessage,
  canPayWithStellar,
  WALLET_PROVIDERS,
  getWalletProvider,
  isFreighterWalletInstalled as isFreighterInstalled,
  isGemWalletInstalled as isGemWalletXrpInstalled,
} from '@/lib/wallets';

export type { WalletDetectionResult, WalletProvider } from '@/lib/wallets';
