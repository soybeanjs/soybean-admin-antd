export function parseRecordId(value: string): number | null {
  if (!/^\d+$/u.test(value)) return null;
  const id = Number(value);
  return Number.isSafeInteger(id) && id >= 0 ? id : null;
}

interface Page<T> {
  records: T[];
  current: number;
  size: number;
  total: number;
}

/** Query the existing list contract, without inventing a separate detail endpoint. */
export async function findPaginatedRecord<T extends { id: number }>(
  loadPage: (current: number) => Promise<Page<T>>,
  id: number,
  signal?: AbortSignal
): Promise<T | null> {
  for (let current = 1; current <= 50; current += 1) {
    signal?.throwIfAborted();
    const page = await loadPage(current);
    signal?.throwIfAborted();
    const record = page.records.find(item => item.id === id);
    if (record) return record;
    if (
      !Number.isSafeInteger(page.total) ||
      page.total < 0 ||
      !Number.isSafeInteger(page.size) ||
      page.size <= 0 ||
      page.current !== current
    ) {
      throw new Error('INVALID_PAGINATION');
    }
    if (current * page.size >= page.total) return null;
    if (!page.records.length) throw new Error('INCOMPLETE_PAGE');
  }
  throw new Error('DETAIL_LOOKUP_LIMIT');
}

export interface WorkspaceDraft {
  text: string;
  count: number;
}
export function normalizeWorkspaceDraft(value: unknown): WorkspaceDraft {
  if (!value || typeof value !== 'object') return { text: '', count: 0 };
  const draft = value as Partial<WorkspaceDraft>;
  return {
    text: typeof draft.text === 'string' ? draft.text.slice(0, 2000) : '',
    count:
      typeof draft.count === 'number' && Number.isSafeInteger(draft.count) && draft.count >= 0
        ? Math.min(draft.count, 1_000_000)
        : 0
  };
}

/** Authorization starts through a configured backend. Never accept executable URL schemes. */
export function resolveAuthEntryURL(value: string | undefined, origin: string): string | null {
  if (!value?.trim()) return null;
  try {
    const url = new URL(value, origin);
    if (url.username || url.password) return null;
    if (url.protocol !== 'https:' && !(url.protocol === 'http:' && url.origin === origin)) return null;
    return url.href;
  } catch {
    return null;
  }
}
