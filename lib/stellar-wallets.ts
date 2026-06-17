'use client';

export type WalletProvider = 'freighter' | 'gem';

function toBase64Signature(value: string | Uint8Array): string {
  if (typeof value === 'string') return value;
  return Buffer.from(value).toString('base64');
}

export async function connectFreighterWallet(): Promise<string> {
  const { isConnected, requestAccess, getAddress } = await import('@stellar/freighter-api');

  const connected = await isConnected();
  if (!connected) {
    const access = await requestAccess();
    if (access.error) {
      throw new Error(access.error);
    }
  }

  const addressResult = await getAddress();
  if (addressResult.error || !addressResult.address) {
    throw new Error(addressResult.error ?? 'Freighter address unavailable');
  }

  return addressResult.address;
}

export async function signWithFreighter(message: string, address: string): Promise<string> {
  const { signMessage } = await import('@stellar/freighter-api');
  const result = await signMessage(message, { address });

  if (result.error || !result.signedMessage) {
    throw new Error(result.error ?? 'Freighter signing failed');
  }

  return toBase64Signature(result.signedMessage);
}

type Sep43Wallet = {
  getAddress: () => Promise<{ address: string } | { error: Error }>;
  signMessage: (
    message: string,
    opts?: { address?: string },
  ) => Promise<{ signedMessage: string; signerAddress: string } | { error: Error }>;
};

function getSep43Wallet(): Sep43Wallet | null {
  if (typeof window === 'undefined') return null;
  const wallet = (window as Window & { stellar?: Sep43Wallet }).stellar;
  return wallet ?? null;
}

export async function connectSep43Wallet(): Promise<string> {
  const wallet = getSep43Wallet();
  if (!wallet) {
    throw new Error('No SEP-0043 wallet detected in browser (Gem / compatible)');
  }

  const result = await wallet.getAddress();
  if ('error' in result) {
    throw new Error(result.error.message);
  }

  return result.address;
}

export async function signWithSep43Wallet(message: string, address: string): Promise<string> {
  const wallet = getSep43Wallet();
  if (!wallet) {
    throw new Error('No SEP-0043 wallet detected in browser');
  }

  const result = await wallet.signMessage(message, { address });
  if ('error' in result) {
    throw new Error(result.error.message);
  }

  return result.signedMessage;
}

export async function connectWallet(provider: WalletProvider): Promise<string> {
  return provider === 'freighter' ? connectFreighterWallet() : connectSep43Wallet();
}

export async function signWalletMessage(
  provider: WalletProvider,
  message: string,
  address: string,
): Promise<string> {
  return provider === 'freighter'
    ? signWithFreighter(message, address)
    : signWithSep43Wallet(message, address);
}
