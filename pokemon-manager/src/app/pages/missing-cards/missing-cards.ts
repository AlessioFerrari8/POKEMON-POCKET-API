import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal, Signal, WritableSignal, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { PokemonSDK } from '../../core/services/pokemon-sdk';
import { UsersService } from '../../core/services/users-service';

import { IPokemon } from '../../shared/components/interfaces/i-pokemon';
import { ILightPokemon } from '../../shared/components/interfaces/i-light-pokemon';
import { CardGridComponent } from '../../shared/components/card-grid/card-grid';
import { CardItemComponent } from '../../shared/components/card-item/card-item';

@Component({
  selector: 'app-missing-cards',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CardGridComponent, CardItemComponent],
  templateUrl: './missing-cards.html',
  styleUrl: './missing-cards.css',
})
export class MissingCards implements OnInit {
  private service = inject(PokemonSDK);
  private usersService = inject(UsersService);

  filterType = new FormControl<string>('all', { nonNullable: true });
  searchQuery = new FormControl<string>('', { nonNullable: true });
  isDropdownOpen: WritableSignal<boolean> = signal(false);
  searchResults: WritableSignal<IPokemon[]> = signal([]);
  isLoading: WritableSignal<boolean> = signal(false);
  errorMessage: WritableSignal<string> = signal('');
  selectedCard: WritableSignal<IPokemon | null> = signal(null);
  isLoadingDetails: WritableSignal<boolean> = signal(false);

  // Dati dei set (con il numero totale di carte per ogni espansione)
  expansionSetData: WritableSignal<Map<string, { name: string; total: number }>> = signal(new Map());

  // carte mancanti prese direttamente dal profilo utente
  userMissingCards: Signal<ILightPokemon[]> = computed(
    () => this.usersService.userData()?.missingCards ?? []
  );

  // parte per raggruppare carte in base a espansione
  expansionStats: Signal<Map<string, { name: string; total: number; missing: number; owned: number; percentage: number }>> = computed(() => {
    const stats = new Map<string, { name: string; total: number; missing: number; owned: number; percentage: number }>();
    const setData = this.expansionSetData();
    const missingCardsArray = this.userMissingCards();
    const userData = this.usersService.userData(); // Crea dipendenza esplicita
    const ownedCardsIds = userData?.ownedCards ?? [];

    console.log('=== EXPANSION STATS CALCULATION ===');
    console.log('Total setData loaded:', setData.size);
    console.log('Missing cards count:', missingCardsArray.length);
    console.log('Owned cards IDs count:', ownedCardsIds.length);
    console.log('User missing cards:', missingCardsArray);

    // Step 1: Popola con TUTTE le espansioni disponibili
    this.filterOptions.forEach(option => {
      if (option.value !== 'all') {
        const total = setData.get(option.value)?.total ?? 0;
        stats.set(option.value, {
          name: option.label,
          total: total,
          missing: 0,
          owned: 0,
          percentage: 0
        });
      }
    });

    // Step 2: Conta le carte MANCANTI per espansione (da missingCards)
    missingCardsArray.forEach(card => {
      let cardSetId = card.set?.id?.trim().toUpperCase() || '';
      
      // Fallback: se setId è vuoto, estrai dalla URL dell'immagine
      if (!cardSetId && card.image) {
        const parts = card.image.split('/');
        cardSetId = (parts[parts.length - 2] || '').toUpperCase();
        console.log(`Fallback: Extracted setId from image URL: "${cardSetId}" for card ${card.name}`);
      }
      
      console.log(`Processing card: ${card.name}, setId: "${cardSetId}"`);

      // Cerca una corrispondenza nei filterOptions (case-insensitive)
      const matchedOption = this.filterOptions.find(opt => 
        opt.value.toUpperCase() === cardSetId
      );

      if (matchedOption) {
        const stat = stats.get(matchedOption.value);
        if (stat) {
          stat.missing += 1;
          console.log(`✓ Missing card matched to set ${matchedOption.value}: ${card.name}`);
        }
      } else {
        console.warn(`✗ No matching set found for card with setId: "${cardSetId}"`, card);
      }
    });

    // Step 3: Calcola le carte possedute = TOTALE - MANCANTI
    stats.forEach((stat, setId) => {
      const total = setData.get(setId)?.total ?? 0;
      stat.total = total;
      stat.owned = Math.max(0, total - stat.missing);
      stat.percentage = stat.total > 0 ? Math.round((stat.owned / stat.total) * 100) : 0;
      
      console.log(`Set ${setId}: Total=${total}, Missing=${stat.missing}, Owned=${stat.owned}, Percentage=${stat.percentage}%`);
    });
    
    console.log('=== END CALCULATION ===');
    return stats;
  });

  // rarità
  selectedRarity = new FormControl<string>('all', { nonNullable: true });
  
  // Signal reattivo per il valore della rarità (necessario per aggiornare i computed signal)
  selectedRarityValue: WritableSignal<string> = signal('all');

  rarityOptions = [
    { value: 'all', label: 'All Rarities' },
    { value: 'One Diamond', label: 'One Diamond' },
    { value: 'Two Diamonds', label: 'Two Diamonds' },
    { value: 'Three Diamonds', label: 'Three Diamonds' },
    { value: 'Four Diamonds', label: 'Ex' },
    { value: 'One Star', label: 'Full-art' },
    { value: 'Two Star', label: 'Holo' },
    { value: 'Three Star', label: 'Immersive' },
    { value: 'Crown', label: 'Crown' },
  ];
  isRarityDropdownOpen: WritableSignal<boolean> = signal(false);

  // Carte ricercate filtrate per rarità
  filteredSearchResults: Signal<IPokemon[]> = computed(() => {
    const results = this.searchResults();
    // NOTA: L'API non ritorna il campo 'rarity' nella ricerca, quindi non filtrare
    return results;
  });


  // Carte mancanti filtrate per rarità
  filteredMissingCards: Signal<ILightPokemon[]> = computed(() => {
    const cards = this.userMissingCards();
    const selectedRarity = this.selectedRarityValue();

    if (selectedRarity === 'all') {
      return cards;
    }

    return cards.filter(card => card.rarity === selectedRarity);
  });

  filterOptions = [
    { value: 'all', label: 'Others' },
    { value: 'A1', label: 'Genetic Apex' },
    { value: 'A1a', label: 'Mythical Island' },
    { value: 'A2', label: 'Space-Time Smackdown' },
    { value: 'A2a', label: 'Triumphant Light' },
    { value: 'A2b', label: 'Shining Revelry' },
    { value: 'A3', label: 'Celestial Guardians' },
    { value: 'A3a', label: 'Extradimensional Crisis' },
    { value: 'A3b', label: 'Eevee Groove' },
    { value: 'A4', label: 'Wisdom of Sea and Sky' },
    { value: 'A4a', label: 'Secluded Springs' },
    { value: 'B1', label: 'Mega Rising' },
    { value: 'B1a', label: 'Crimson Blaze' },
    { value: 'B2', label: 'Fantastical Parade' },
    { value: 'B2a', label: 'Paldean Wonders' }
  ];

  toggleDropdown(): void {
    this.isDropdownOpen.update(val => !val);
  }

  selectFilter(value: string): void {
    this.filterType.setValue(value);
    this.isDropdownOpen.set(false);
  }

  getCurrentFilterLabel(): string {
    const selected = this.filterOptions.find(opt => opt.value === this.filterType.value);
    return selected?.label || 'Filter';
  }

  performSearch(): void {
    const query = this.searchQuery.value.trim();

    if (!query) {
      this.errorMessage.set('Please enter a card name');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    // Usa l'endpoint di ricerca per nome che ritorna i dettagli completi (con rarity)
    this.service.searchCards(query).subscribe({
      next: (cards: IPokemon[]) => {
        if (cards && cards.length > 0) {
          this.searchResults.set(cards);
          console.log('Carte trovate:', cards.length);
          console.log('Rarità disponibili:', [...new Set(cards.map(c => c.rarity))]);
        } else {
          this.searchResults.set([]);
          this.errorMessage.set('No cards found with that name');
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error searching cards:', err);
        this.searchResults.set([]);
        this.errorMessage.set('Error searching. Try again.');
        this.isLoading.set(false);
      }
    });
  }

  onCardClicked(card: IPokemon): void {
    this.selectedCard.set(card);
    this.isLoadingDetails.set(true);

    this.service.getPokemonDetails(card.id, card.image).subscribe({
      next: (details) => {
        if (details && Object.keys(details).length > 0) {
          this.selectedCard.set(details);
        }
        this.isLoadingDetails.set(false);
      },
      error: (err) => {
        console.error('Error loading card details:', err);
        this.isLoadingDetails.set(false);
      }
    });
  }

  closeCardDetail(): void {
    this.selectedCard.set(null);
  }

  // Per aprire/chiudere dropdown rarità
  toggleRarityDropdown(): void {
    this.isRarityDropdownOpen.update(val => !val);
  }

  // Per selezionare una rarità
  selectRarity(value: string): void {
    this.selectedRarity.setValue(value);
    this.selectedRarityValue.set(value); // Aggiorna anche il signal reattivo
    this.isRarityDropdownOpen.set(false);
  }

  // Per ottenere l'etichetta della rarità selezionata
  getSelectedRarityLabel(): string {
    const selected = this.rarityOptions.find(opt => opt.value === this.selectedRarityValue());
    return selected?.label || 'Filter by Rarity';
  }

  ngOnInit(): void {
    this.loadExpansionData();
  }

  private loadExpansionData(): void {
    const setDataMap = new Map<string, { name: string; total: number }>();
    let loadedCount = 0;

    // Carica i dati per tutte le espansioni
    this.filterOptions.forEach(option => {
      if (option.value !== 'all') {
        this.service.getSet(option.value).subscribe({
          next: (setData) => {
            if (setData && setData.cardCount) {
              setDataMap.set(option.value, {
                name: option.label,
                // cardCount può essere un numero o un oggetto con campi come 'official' e 'total'
                total: setData.cardCount.total ?? setData.cardCount ?? 0
              });
            }
            loadedCount++;
            // Aggiorna il signal solo quando tutti i set sono stati caricati
            if (loadedCount === this.filterOptions.length - 1) {
              this.expansionSetData.set(setDataMap);
            }
          },
          error: (err) => {
            console.error(`Error loading set data for ${option.value}:`, err);
            setDataMap.set(option.value, {
              name: option.label,
              total: 0
            });
            loadedCount++;
            if (loadedCount === this.filterOptions.length - 1) {
              this.expansionSetData.set(setDataMap);
            }
          }
        });
      }
    });
  }
}
