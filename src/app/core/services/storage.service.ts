import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  // Save data to localStorage
  setItem(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
    console.log(key, localStorage.getItem(key));
  }

  // Retrieve data from localStorage
  getItem(key: string): any {
    const value = localStorage.getItem(key);
    console.log(value);
    return value ? JSON.parse(value) : null;
  }

  // Remove data from localStorage
  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  // Clear all data from localStorage
  clear(): void {
    localStorage.clear();
  }
}
