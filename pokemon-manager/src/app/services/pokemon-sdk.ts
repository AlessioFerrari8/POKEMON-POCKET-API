import { Injectable } from '@angular/core';
import TCGdex from '@tcgdex/sdk';
import { from, map, Observable, shareReplay, catchError, of } from 'rxjs';
import { Root } from '../components/interfaces/i-pokemon';

@Injectable({
  providedIn: 'root',
})
export class PokemonSDK {
  private tcgdex: TCGdex;
  
  // Cache per evitare chiamate ripetute
  private cardsCache$: Observable<Root[]> | null = null;
  
  // Configurazione
  private readonly DEFAULT_RESULTS_LIMIT = 12;

  constructor() {
    this.tcgdex = new TCGdex('en');
  }

  /**
   * Recupera tutte le carte con caching automatico
   */
  getCards(): Observable<Root[]> {
    // Se la cache esiste, riutilizzala
    if (!this.cardsCache$) {
      this.cardsCache$ = from(this.tcgdex.fetch('cards')).pipe(
        map((cards: unknown) => {
          if (!cards || !Array.isArray(cards)) {
            console.warn('Invalid cards data received');
            return [];
          }
          return cards as Root[];
        }),
        catchError((error) => {
          console.error('Error fetching cards:', error);
          return of([]);
        }),
        shareReplay(1) // Cache il risultato per riutilizzarlo
      );
    }
    return this.cardsCache$;
  }

  /**
   * Cerca carte per nome con limite configurabile
   * @param query - Nome del Pokémon da cercare
   * @param limit - Numero massimo di risultati (default: 12)
   */
  searchCards(query: string, limit: number = this.DEFAULT_RESULTS_LIMIT): Observable<Root[]> {
    if (!query || query.trim().length === 0) {
      return of([]);
    }

    const normalizedQuery = query.trim().toLowerCase();

    return this.getCards().pipe(
      map((cards: Root[]) => {
        return cards
          .filter((card) => 
            card.name?.toLowerCase().includes(normalizedQuery)
          )
          .slice(0, limit);
      })
    );
  }

  /**
   * Recupera una singola carta per ID
   * @param id - ID della carta
   */
  getCard(id: string): Observable<Root | null> {
    if (!id || id.trim().length === 0) {
      console.warn('Invalid card ID provided');
      return of(null);
    }

    return from(this.tcgdex.fetch('cards', id)).pipe(
      map((card) => card as Root),
      catchError((error) => {
        console.error(`Error fetching card with ID ${id}:`, error);
        return of(null);
      })
    );
  }

  /**
   * Invalida la cache (utile se servono dati aggiornati)
   */
  clearCache(): void {
    this.cardsCache$ = null;
  }
}