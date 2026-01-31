import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import TCGdex from '@tcgdex/sdk';
import { from, map, Observable, shareReplay, catchError, of, tap } from 'rxjs';
import { IPokemon } from '../components/interfaces/i-pokemon';

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
    // https://api.tcgdex.net/v2/en/cards?name=pikachu
    const url = `https://api.tcgdex.net/v2/en/cards?name=${name}`;
    return this.http.get<IPokemon[]>(url).pipe(
      map(cards => cards.filter(card => card.image && card.image.includes('/tcgp/'))),
      catchError(() => of([]))
    );
  }

  getCards(series: string = 'tcgp'): Observable<IPokemon[]> {
    const url = `https://api.tcgdex.net/v2/en/series/${series}/cards`;
    return this.http.get<IPokemon[]>(url).pipe(
      catchError(() => of([]))
    );
  }

  getSet(setId: string): Observable<any> {
    // https://api.tcgdex.net/v2/en/sets/A1
    const url = `https://api.tcgdex.net/v2/en/sets/${setId}`;
    return this.http.get<any>(url).pipe(
      catchError(() => of(null))
    );
  }

  getMissingCard(setId: string, name: string): Observable<IPokemon[]> {
    const url = `https://api.tcgdex.net/v2/en/sets/${setId}/${name}`;
    return this.http.get<IPokemon[]>(url).pipe(
      catchError(() => of([]))
    );
  }
}