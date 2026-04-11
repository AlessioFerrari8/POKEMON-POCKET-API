import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import TCGdex, { Query } from '@tcgdex/sdk';
import { from, map, Observable, shareReplay, catchError, of, tap } from 'rxjs';
import { IPokemon } from '../../shared/components/interfaces/i-pokemon';
import { API_ENDPOINTS, DEFAULTS } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class PokemonSDK {
  private tcgdex: TCGdex;
  private pocketCardsCache$: Observable<IPokemon[]> | null = null;

  constructor(private http: HttpClient) {
    this.tcgdex = new TCGdex('en');
  }

  searchCards(name: string): Observable<IPokemon[]> {
    const url = API_ENDPOINTS.TCG_CARDS_SEARCH(name);
    return this.http.get<IPokemon[]>(url).pipe(
      map(cards => {
        return cards
          .filter(card => card.image && card.image.includes(DEFAULTS.CARD_IMAGE_FILTER))
          .map(card => {
            // Estrae il setId dall'URL della carta
            const parts = card.image.split('/');
            const setId = parts[parts.length - 2];
            console.log('Card image URL:', card.image);
            console.log('Extracted setId:', setId);
            return {
              ...card,
              set: card.set || { id: setId, name: '', logo: '', symbol: '', cardCount: { official: 0, total: 0 } }
            };
          });
      }),
      catchError(() => of([]))
    );
  }

  getCards(series: string = DEFAULTS.SERIES): Observable<IPokemon[]> {
    const url = API_ENDPOINTS.TCG_SERIES_CARDS(series);
    return this.http.get<IPokemon[]>(url).pipe(
      catchError(() => of([]))
    );
  }

  getSet(setId: string): Observable<any> {
    const url = API_ENDPOINTS.TCG_SET(setId);
    return this.http.get<any>(url).pipe(
      catchError(() => of(null))
    );
  }

  getMissingCard(setId: string, name: string): Observable<IPokemon[]> {
    const url = API_ENDPOINTS.TCG_CARD_IN_SET(setId, name);
    return this.http.get<IPokemon[]>(url).pipe(
      catchError(() => of([]))
    );
  }

  getPokemonDetails(id: string, imageUrl: string): Observable<IPokemon> {
    const parts = imageUrl.split('/');
    const setId = parts[parts.length - 2]; // Estrae il set ID (penultima parte del path)
    const cardId = parts[parts.length - 1]; // Estrae l'ID della carta (ultima parte del path)
    const url = API_ENDPOINTS.TCG_CARD_IN_SET(setId, cardId);
    return this.http.get<any>(url).pipe(
      map(card => {
        return {
          ...card,
          set: card.set || { id: setId, name: '', logo: '', symbol: '', cardCount: { official: 0, total: 0 } }
        };
      }),
      catchError(() => of())
    );
  }
}