import { isFreighterWalletInstalled } from '@/lib/wallets/freighter-wallet';
import { isGemWalletInstalled } from '@/lib/wallets/gem-wallet';
import type { WalletDetectionResult, WalletProvider } from '@/lib/wallets/types';

export { WALLET_PROVIDERS, getWalletProvider } from '@/lib/wallets/types';
export type { WalletDetectionResult, WalletProvider, WalletProviderMeta } from '@/lib/wallets/types';
export { connectWallet, signWalletMessage } from '@/lib/wallets/wallet-factory';
export {
  connectFreighterWallet,
  isFreighterWalletInstalled,
  signFreighterTransaction,
} from '@/lib/wallets/freighter-wallet';
export { connectGemWallet, isGemWalletInstalled } from '@/lib/wallets/gem-wallet';

const DETECTION_POLL_MS = 100;
const DETECTION_TIMEOUT_MS = 2500;

async function waitForWalletInjection(): Promise<void> {
  const deadline = Date.now() + DETECTION_TIMEOUT_MS;
  while (Date.now() < deadline) {
    if (typeof window !== 'undefined') {
      const win = window as Window & { freighterApi?: unknown; GemWalletApi?: unknown };
      if (win.freighterApi || win.GemWalletApi) return;
    }
    await new Promise((resolve) => setTimeout(resolve, DETECTION_POLL_MS));
  }
}

export async function detectAvailableWallets(): Promise<WalletDetectionResult> {
  await waitForWalletInjection();

  const [freighterInstalled, gemInstalled] = await Promise.all([
    isFreighterWalletInstalled(),
    isGemWalletInstalled(),
  ]);

  return { freighterInstalled, gemInstalled };
}

/** Stellar (XLM) checkout only supports Freighter in the browser. */
export function canPayWithStellar(provider: WalletProvider): boolean {
  return provider === 'freighter';
}

export function canPayWithXrp(provider: WalletProvider): boolean {
  return provider === 'gem';
}
