// ============================================================================
// VGK Property Command - Storage Service
// localStorage wrapper with JSON serialization and error handling
// ============================================================================

class StorageService {
  private isAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  get<T>(key: string): T | null {
    if (!this.isAvailable()) {
      console.error('localStorage is not available');
      return null;
    }

    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error reading from localStorage (key: ${key}):`, error);
      return null;
    }
  }

  set<T>(key: string, value: T): boolean {
    if (!this.isAvailable()) {
      console.error('localStorage is not available');
      return false;
    }

    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage (key: ${key}):`, error);
      return false;
    }
  }

  remove(key: string): boolean {
    if (!this.isAvailable()) {
      console.error('localStorage is not available');
      return false;
    }

    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing from localStorage (key: ${key}):`, error);
      return false;
    }
  }

  clear(): boolean {
    if (!this.isAvailable()) {
      console.error('localStorage is not available');
      return false;
    }

    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }

  getAllKeys(): string[] {
    if (!this.isAvailable()) return [];

    try {
      return Object.keys(localStorage);
    } catch (error) {
      console.error('Error getting localStorage keys:', error);
      return [];
    }
  }
}

export const storage = new StorageService();
