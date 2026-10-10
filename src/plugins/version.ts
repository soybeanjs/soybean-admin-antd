/** Invalid responses and network failures must never announce a new version. */
export async function readAppVersion(url: string, fetcher: typeof fetch = fetch): Promise<string | null> {
  try {
    const response = await fetcher(url, { cache: 'no-store', signal: AbortSignal.timeout(10_000) });
    if (!response.ok) return null;
    const data: unknown = await response.json();
    if (!data || typeof data !== 'object' || !('buildTime' in data)) return null;
    const { buildTime } = data;
    return typeof buildTime === 'string' && buildTime.trim() ? buildTime : null;
  } catch {
    return null;
  }
}
