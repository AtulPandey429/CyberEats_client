import { ensureGemInstalled, unwrapGemResponse } from '@/lib/wallets/gem-wallet-response';

export interface GemConnection {
  address: string;
  publicKey: string;
  walletType: 'gem';
}

export async function isGemWalletInstalled(): Promise<boolean> {
  try {
    const { isInstalled } = await import('@gemwallet/api');
    const response = await isInstalled();
    return response?.result?.isInstalled === true;
  } catch {
    return false;
  }
}

export async function connectGemWallet(): Promise<GemConnection> {
  const { isInstalled, getPublicKey } = await import('@gemwallet/api');

  await ensureGemInstalled(isInstalled);

  const keyResponse = await getPublicKey();
  const publicKey = unwrapGemResponse(keyResponse, 'publicKey');
  const address =
    (keyResponse.result?.address as string | undefined) ||
    unwrapGemResponse(keyResponse, 'address');

  return { address, publicKey, walletType: 'gem' };
}

export async function signGemMessage(message: string): Promise<string> {
  const { signMessage } = await import('@gemwallet/api');
  const response = await signMessage(message);
  return unwrapGemResponse(response, 'signedMessage');
}

export async function sendGemPayment(input: {
  destination: string;
  amountXrp: number;
}): Promise<string> {
  const { sendPayment } = await import('@gemwallet/api');
  const drops = Math.round(Number(input.amountXrp) * 1_000_000);
  const response = await sendPayment({
    destination: input.destination,
    amount: String(drops),
  });
  return unwrapGemResponse(response, 'hash');
}
