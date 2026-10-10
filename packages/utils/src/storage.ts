/** The storage type */
export type StorageType = 'local' | 'session';

export function createStorage<T extends object>(type: StorageType, storagePrefix: string) {
  const fallback = new Map<string, string | null>();
  const getStorage = () => (type === 'session' ? window.sessionStorage : window.localStorage);

  const storage = {
    /**
     * Set session
     *
     * @param key Session key
     * @param value Session value
     */
    set<K extends keyof T>(key: K, value: T[K]) {
      const json = JSON.stringify(value);

      const storageKey = `${storagePrefix}${key as string}`;
      try {
        getStorage().setItem(`${storagePrefix}${key as string}`, json);
      } catch {
        fallback.set(storageKey, json);
        return;
      }
      fallback.delete(storageKey);
    },
    /**
     * Get session
     *
     * @param key Session key
     */
    get<K extends keyof T>(key: K): T[K] | null {
      const storageKey = `${storagePrefix}${key as string}`;
      try {
        const stg = getStorage();
        const json = fallback.has(storageKey) ? fallback.get(storageKey) : stg.getItem(storageKey);
        if (json === null || json === undefined) return null;
        try {
          return JSON.parse(json) as T[K];
        } catch {
          stg.removeItem(storageKey);
        }
      } catch {
        // Storage access can throw in restricted browser contexts.
      }
      const json = fallback.get(storageKey);
      return json ? (JSON.parse(json) as T[K]) : null;
    },
    remove(key: keyof T) {
      const storageKey = `${storagePrefix}${key as string}`;
      fallback.delete(storageKey);
      try {
        getStorage().removeItem(storageKey);
      } catch {
        fallback.set(storageKey, null);
      }
    },
    clear() {
      fallback.clear();
      try {
        const stg = getStorage();
        const keys = Array.from({ length: stg.length }, (_, index) => stg.key(index));
        keys.forEach(key => {
          if (!key?.startsWith(storagePrefix)) return;
          try {
            stg.removeItem(key);
          } catch {
            fallback.set(key, null);
          }
        });
      } catch {}
    }
  };
  return storage;
}
