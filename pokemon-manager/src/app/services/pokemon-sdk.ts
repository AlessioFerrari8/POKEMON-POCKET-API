import { Injectable } from '@angular/core';
import TCGdex from '@tcgdex/sdk';
import { from, map, Observable, shareReplay, catchError, of, tap } from 'rxjs';
import { Root } from '../components/interfaces/i-pokemon';

@Injectable({
  providedIn: 'root',
})
export class PokemonSDK {
  private tcgdex: TCGdex;
  
  private pocketCardsCache$: Observable<Root[]> | null = null;
  
  private readonly DEFAULT_RESULTS_LIMIT = 12;
  private readonly POCKET_CATEGORY = 'Pokemon Pocket';

  constructor() {
    this.tcgdex = new TCGdex('en');
  }

  /**
   * Recupera SOLO le carte di Pokémon Pocket
   */
  getPocketCards(): Observable<Root[]> {
    if (!this.pocketCardsCache$) {
      this.pocketCardsCache$ = from(this.tcgdex.fetch('cards')).pipe(
        tap((cards: any) => {
          console.log('📦 Total cards fetched:', Array.isArray(cards) ? cards.length : 'NOT AN ARRAY');
          
          if (Array.isArray(cards) && cards.length > 0) {
            console.log('🔍 First card structure:', cards[0]);
            console.log('📋 Available categories:', [...new Set(cards.map((c: any) => c.category))]);
            
            const pocketCards = cards.filter((c: any) => c.category === this.POCKET_CATEGORY);
            console.log(`✅ Found ${pocketCards.length} Pokémon Pocket cards`);
            
            if (pocketCards.length === 0) {
              console.warn('⚠️ NO POCKET CARDS FOUND! Check if category name is correct.');
              console.log('📝 Try these categories:', [...new Set(cards.map((c: any) => c.category))].slice(0, 5));
            }
          }
        }),
        map((cards: unknown) => {
          if (!cards || !Array.isArray(cards)) {
            console.warn('Invalid cards data received');
            return [];
          }
          
          // Filtra solo carte con category "Pokemon Pocket"
          const pocketCards = (cards as Root[]).filter(card => 
            card.category === this.POCKET_CATEGORY
          );
          
          return pocketCards;
        }),
        catchError((error) => {
          console.error('❌ Error fetching Pokémon Pocket cards:', error);
          return of([]);
        }),
        shareReplay(1)
      );
    }
    return this.pocketCardsCache$;
  }

  /**
   * Cerca carte per nome SOLO in Pokémon Pocket
   */
  searchCards(query: string, limit: number = this.DEFAULT_RESULTS_LIMIT): Observable<Root[]> {
    if (!query || query.trim().length === 0) {
      return of([]);
    }

    const normalizedQuery = query.trim().toLowerCase();
    console.log(`🔎 Searching for: "${normalizedQuery}"`);

    return this.getPocketCards().pipe(
      tap(cards => console.log(`📊 Total Pocket cards available: ${cards.length}`)),
      map((cards: Root[]) => {
        const results = cards.filter((card) => {
          const matches = card.name?.toLowerCase().includes(normalizedQuery);
          if (matches) {
            console.log(`✓ Match found: ${card.name} (${card.category})`);
          }
          return matches;
        });
        
        console.log(`🎯 Search results for "${query}": ${results.length} cards`);
        return results.slice(0, limit);
      })
    );
  }

  clearCache(): void {
    this.pocketCardsCache$ = null;
  }
}