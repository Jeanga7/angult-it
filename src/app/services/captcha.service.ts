import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CaptchaService {
  private readonly STORAGE_KEY = 'captchaProgress';

  saveProgress(progress: any) {
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progress));
    }
  }

  getProgress(): any {
    if (this.isLocalStorageAvailable()) {
      const storedProgress = localStorage.getItem(this.STORAGE_KEY);
      return storedProgress ? JSON.parse(storedProgress) : null;
    }
    return null;
  }

  clearProgress() {
    if (this.isLocalStorageAvailable()) {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  private isLocalStorageAvailable(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }
}
