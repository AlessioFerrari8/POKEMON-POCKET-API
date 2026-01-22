import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { PokemonSDK } from '../../services/pokemon-sdk';
import { Root } from '../interfaces/i-pokemon';
import { tap, debounceTime, distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css'
})
export class SearchBar {
  private service = inject(PokemonSDK);

  // Signals pubblici
  public searchResults: WritableSignal<Root[]> = signal([]);
  public hasSearched: WritableSignal<boolean> = signal(false);
  public errorMessage: WritableSignal<string> = signal('');
  public isLoading: WritableSignal<boolean> = signal(false);

  // Form control tipizzato
  inputName = new FormControl<string>('', { nonNullable: true });

  constructor() {
    // Auto-reset quando l'input viene svuotato
    this.inputName.valueChanges.pipe(
      tap(value => {
        if (!this.isValidQuery(value)) {
          this.resetSearch();
        }
      }),
      takeUntilDestroyed()
    ).subscribe();
  }

  // Funzione chiamata dal submit del form
  performSearchOnClick(): void {
    const query = this.inputName.value.trim();
    
    if (!this.isValidQuery(query)) {
      this.resetSearch();
      return;
    }

    this.hasSearched.set(true);
    this.errorMessage.set('');
    this.isLoading.set(true);

    this.service.searchCards(query).subscribe({
      next: (cards) => {
        console.log(`Found ${cards.length} Pokémon Pocket cards for "${query}"`);
        this.searchResults.set(cards);
        this.isLoading.set(false);
        
        if (cards.length === 0) {
          this.errorMessage.set(`No results found for "${query}"`);
        }
      },
      error: (err) => {
        console.error('Error during search:', err);
        this.searchResults.set([]);
        this.errorMessage.set('Unable to search. Please try again.');
        this.isLoading.set(false);
      }
    });
  }

  private resetSearch(): void {
    this.hasSearched.set(false);
    this.searchResults.set([]);
    this.errorMessage.set('');
    this.isLoading.set(false);
  }

  private isValidQuery(value: string): boolean {
    return value.trim().length > 0;
  }
}