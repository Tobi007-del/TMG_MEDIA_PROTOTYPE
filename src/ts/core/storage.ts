export interface StorageAdapterConstructor {
  new (namespace: string): StorageAdapter;
}

// The Abstract Contract
export abstract class StorageAdapter {
  public readonly namespace: string;
  constructor(namespace: string) {
    this.namespace = namespace;
  }
  abstract get(key: string): any;
  abstract set(key: string, value: any): void;
  abstract remove(key: string): void;
}

// The Default Implementation (Local Storage)
export class LocalStorageAdapter extends StorageAdapter {
  get(key: string) {
    try {
      const v = localStorage.getItem(`${this.namespace}_${key}`);
      return v ? JSON.parse(v) : undefined;
    } catch {
      return undefined;
    }
  }

  set(key: string, value: any) {
    try {
      localStorage.setItem(`${this.namespace}_${key}`, JSON.stringify(value));
    } catch (e) {
      console.warn("[TMG Local Storage] Storage full or unavailable", e);
    }
  }

  remove(key: string) {
    localStorage.removeItem(`${this.namespace}_${key}`);
  }
}
