import { connectFreighterWallet, signFreighterMessage } from '@/lib/wallets/freighter-wallet';
import { connectGemWallet, signGemMessage } from '@/lib/wallets/gem-wallet';
import type { WalletProvider } from '@/lib/wallets/types';

export async function connectWallet(provider: WalletProvider): Promise<string> {
  if (provider === 'freighter') {
    const connected = await connectFreighterWallet();
    return connected.address;
  }

  const connected = await connectGemWallet();
  return connected.address;
}

export async function signWalletMessage(
  provider: WalletProvider,
  message: string,
  address: string,
): Promise<string> {
  if (provider === 'freighter') {
    return signFreighterMessage(message, address);
  }
  return signGemMessage(message);
}
