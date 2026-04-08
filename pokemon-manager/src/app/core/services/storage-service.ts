import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  /**
   * Salva un oggetto nel localStorage
   */
  setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Errore nel salvataggio di ${key}:`, error);
    }
  }

  /**
   * Recupera un oggetto dal localStorage
   */
  getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Errore nel recupero di ${key}:`, error);
      return null;
    }
  }

  /**
   * Rimuove un elemento dal localStorage
   */
  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Errore nella rimozione di ${key}:`, error);
    }
  }

  /**
   * Pulisce tutto il localStorage
   */
  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Errore nella pulizia del localStorage:', error);
    }
  }

  /**
   * Verifica se una chiave esiste
   */
  hasItem(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }
}