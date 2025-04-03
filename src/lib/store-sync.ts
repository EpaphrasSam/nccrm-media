type RefetchCallback = () => void;

class StoreSync {
  private callbacks: Set<RefetchCallback> = new Set();

  subscribe(callback: RefetchCallback) {
    this.callbacks.add(callback);
    return () => this.callbacks.delete(callback);
  }

  trigger() {
    this.callbacks.forEach((callback) => callback());
  }
}

export const storeSync = new StoreSync();
