import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PokemonSDK } from '../../services/pokemon-sdk';
import { Root } from '../interfaces/i-pokemon';
import { tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css'
})

export class SearchBar {

  constructor() {
    this.inputName.valueChanges.pipe(
      tap(value => {
        if (!value?.trim()) {
          this.hasSearched.set(false);
          this.searchResults.set([]);
        }
      }),
      takeUntilDestroyed() // chiude automaticamente quando il componente muore
    ).subscribe();
  }

  public errorMessage: WritableSignal<string> = signal('');

  private service: PokemonSDK = inject(PokemonSDK);

  // Segnali pubblici per il componente genitore
  public searchResults: WritableSignal<Root[]> = signal([]);
  public hasSearched: WritableSignal<boolean> = signal(false);

  inputName: FormControl = new FormControl('');
  
  // Funzione chiamata dal (click) del bottone
  performSearchOnClick(): void {
    const query = this.inputName.value;
    if (query && query.trim().length > 0) {
      this.hasSearched.set(true); // Imposta che una ricerca è stata effettuata
      this.service.searchCards(query.trim()).subscribe({
        next: (cards) => {
          console.log('Struttura prima carta:', JSON.stringify(cards[0], null, 2));
          this.searchResults.set(cards);
        },
        error: (err) => {
          console.error('Error during search:', err);
          this.searchResults.set([]);
          this.errorMessage.set('Unable to search. Please try again.');
        }
      });
    } else {
      // Se l'utente clicca "cerca" con l'input vuoto, resettiamo
      this.hasSearched.set(false);
      this.searchResults.set([]);
    }
  }

  private isValidQuery(value: string | null): boolean {
    return !!value?.trim();
  }

}
