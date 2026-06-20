export interface FreighterConnection {
  address: string;
  walletType: 'freighter';
}

const FREIGHTER_PROBE_MS = 2000;

function hasFreighterApi(): boolean {
  if (typeof window === 'undefined') return false;
  const win = window as Window & { freighterApi?: unknown; freighter?: boolean };
  return Boolean(win.freighterApi || win.freighter);
}

export async function isFreighterWalletInstalled(): Promise<boolean> {
  if (hasFreighterApi()) return true;

  try {
    const { isConnected } = await import('@stellar/freighter-api');
    const result = await Promise.race([
      isConnected(),
      new Promise<{ isConnected: false; error?: undefined }>((resolve) => {
        setTimeout(() => resolve({ isConnected: false }), FREIGHTER_PROBE_MS);
      }),
    ]);
    return !result.error && result.isConnected;
  } catch {
    return false;
  }
}

export async function connectFreighterWallet(): Promise<FreighterConnection> {
  const { isConnected, isAllowed, requestAccess, getAddress } = await import(
    '@stellar/freighter-api'
  );

  const connection = await isConnected();
  if (connection.error) {
    throw new Error(connection.error.message);
  }
  if (!connection.isConnected) {
    throw new Error('Freighter extension is not installed — get it at https://www.freighter.app');
  }

  const allowed = await isAllowed();
  if (allowed.isAllowed && !allowed.error) {
    const existing = await getAddress();
    if (existing.address && !existing.error) {
      return { address: existing.address, walletType: 'freighter' };
    }
  }

  const access = await requestAccess();
  if (access.error || !access.address) {
    throw new Error(
      access.error?.message ?? 'Freighter access denied — unlock the wallet and approve this site',
    );
  }

  return { address: access.address, walletType: 'freighter' };
}

function toBase64Signature(value: string | Uint8Array): string {
  if (typeof value === 'string') return value;
  return Buffer.from(value).toString('base64');
}

export async function signFreighterMessage(message: string, address: string): Promise<string> {
  const { signMessage } = await import('@stellar/freighter-api');
  const result = await signMessage(message, { address });

  if (result.error || !result.signedMessage) {
    throw new Error(result.error ?? 'Freighter signing failed');
  }

  return toBase64Signature(result.signedMessage);
}

export async function signFreighterTransaction(
  transactionXdr: string,
  networkPassphrase: string,
  address: string,
): Promise<string> {
  const { signTransaction } = await import('@stellar/freighter-api');
  const result = await signTransaction(transactionXdr, { networkPassphrase, address });
  if (result.error || !result.signedTxXdr) {
    throw new Error(result.error?.message ?? 'Freighter did not sign the payment');
  }
  return result.signedTxXdr;
}
