export function createRecordCache<T extends { id: number }>(capacity = 200, ttl = 60_000) {
  const records = new Map<number, { record: T; expires: number }>();
  return {
    set(record: T) {
      records.delete(record.id);
      records.set(record.id, { record: structuredClone(record), expires: Date.now() + ttl });
      while (records.size > capacity) records.delete(records.keys().next().value!);
    },
    get(id: number): T | null {
      const item = records.get(id);
      if (!item || item.expires <= Date.now()) {
        records.delete(id);
        return null;
      }
      return structuredClone(item.record);
    },
    clear() {
      records.clear();
    }
  };
}

export const userCache = createRecordCache<Api.SystemManage.User>();
