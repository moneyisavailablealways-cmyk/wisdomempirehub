// IndexedDB cache for wisdom data
const DB_NAME = 'wisdom_cache';
const DB_VERSION = 1;
const STORE_NAME = 'items';
const META_STORE = 'meta';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(META_STORE)) {
        db.createObjectStore(META_STORE, { keyPath: 'key' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export interface CachedWisdomItem {
  id: string;
  type: string;
  subcategory: string;
  text: string;
  origin: string;
  created_at: string;
  video_url?: string;
  audio_voice_type?: string;
}

export async function getCachedItems(table: string, offset: number, limit: number): Promise<CachedWisdomItem[] | null> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    
    return new Promise((resolve) => {
      const req = store.getAll();
      req.onsuccess = () => {
        const all = (req.result as CachedWisdomItem[]).filter(i => i.type === table);
        if (all.length === 0) { resolve(null); return; }
        // Sort by created_at desc
        all.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        resolve(all.slice(offset, offset + limit));
      };
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

export async function setCachedItems(items: CachedWisdomItem[]): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    for (const item of items) {
      store.put(item);
    }
  } catch {
    // Silently fail cache writes
  }
}

export async function getCachedCount(table: string): Promise<number | null> {
  try {
    const db = await openDB();
    const tx = db.transaction(META_STORE, 'readonly');
    const store = tx.objectStore(META_STORE);
    return new Promise((resolve) => {
      const req = store.get(`count_${table}`);
      req.onsuccess = () => resolve(req.result?.value ?? null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

export async function setCachedCount(table: string, count: number): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(META_STORE, 'readwrite');
    const store = tx.objectStore(META_STORE);
    store.put({ key: `count_${table}`, value: count });
  } catch {
    // Silently fail
  }
}

export async function getCachedSubcategoryCounts(table: string): Promise<Record<string, number> | null> {
  try {
    const db = await openDB();
    const tx = db.transaction(META_STORE, 'readonly');
    const store = tx.objectStore(META_STORE);
    return new Promise((resolve) => {
      const req = store.get(`subcats_${table}`);
      req.onsuccess = () => resolve(req.result?.value ?? null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

export async function setCachedSubcategoryCounts(table: string, counts: Record<string, number>): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(META_STORE, 'readwrite');
    const store = tx.objectStore(META_STORE);
    store.put({ key: `subcats_${table}`, value: counts });
  } catch {
    // Silently fail
  }
}
