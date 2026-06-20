/**
 * @gemwallet/api v3 wraps every call as { type: "response"|"reject", result?: object }
 * Ported from personal project (D:/live/personal).
 */

export function unwrapGemResponse<T extends Record<string, unknown>>(
  response: { type?: string; result?: T } | null | undefined,
  field: keyof T & string,
): string {
  if (!response) {
    throw new Error('No response from Gem Wallet');
  }
  if (response.type === 'reject') {
    throw new Error('Request rejected in Gem Wallet');
  }
  const value = response.result?.[field];
  if (value == null || value === '') {
    throw new Error('Gem Wallet returned no data — approve the popup to continue');
  }
  return String(value);
}

export async function ensureGemInstalled(
  isInstalled: () => Promise<{ result?: { isInstalled?: boolean } }>,
): Promise<void> {
  const response = await isInstalled();
  if (response?.result?.isInstalled !== true) {
    throw new Error('Gem Wallet extension is not installed. Get it at https://gemwallet.app');
  }
}
