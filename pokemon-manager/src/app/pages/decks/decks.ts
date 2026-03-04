import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PokemonSDK } from '../../services/pokemon-sdk';
import { IPokemon } from '../../components/interfaces/i-pokemon';
import { ILightPokemon } from '../../components/interfaces/i-light-pokemon';
import { IDeck } from '../../components/interfaces/i-deck';
import { SearchBar } from '../../components/search-bar/search-bar';
import { CardGridComponent } from '../../components/card-grid/card-grid';
import { UsersService } from '../../services/users-service';

@Component({
  selector: 'app-decks',
  standalone: true,
  imports: [CommonModule, FormsModule, SearchBar, CardGridComponent],
  templateUrl: './decks.html',
  styleUrl: './decks.css',
  host: { class: 'block h-full' },
})
export class Decks {
  allCards: IPokemon[] = [];
  filteredCards: IPokemon[] = [];
  deckSlots: (IPokemon | null)[] = Array(20).fill(null);
  loading = true;
  skeletons = Array(20);
  selectedType = '';
  deckName = '';

  activeTab = signal<'cards' | 'mydecks'>('cards');
  saveStatus = signal<'idle' | 'saving' | 'saved' | 'error'>('idle');
  saveMessage = signal('');

  savedDecks = computed(() => this.usersService.userData()?.decks ?? []);

  private cardCounts: Map<string, number> = new Map();
  private usersService = inject(UsersService);

  constructor(private sdk: PokemonSDK) {}

  onSearchResults(results: IPokemon[]) {
    this.loading = false;
    this.filteredCards = results;
  }

  addCard(card: IPokemon) {
    const count = this.cardCounts.get(card.id) || 0;
    if (count >= 2) return;
    const emptyIndex = this.deckSlots.findIndex(s => s === null);
    if (emptyIndex === -1) return;
    this.deckSlots[emptyIndex] = card;
    this.cardCounts.set(card.id, count + 1);
  }

  removeCard(index: number) {
    const card = this.deckSlots[index];
    if (!card) return;
    this.deckSlots[index] = null;
    const count = this.cardCounts.get(card.id) || 1;
    this.cardCounts.set(card.id, count - 1);
  }

  clearDeck() {
    this.deckSlots = Array(20).fill(null);
    this.cardCounts.clear();
  }

  getCount(id: string): number {
    return this.cardCounts.get(id) || 0;
  }

  getDeckCount(): number {
    return this.deckSlots.filter(s => s !== null).length;
  }

  getDeckProgress(): number {
    return (this.getDeckCount() / 20) * 100;
  }

  exportDeck(): void {
    const cards = this.deckSlots.filter((s): s is IPokemon => s !== null);
    if (cards.length === 0) return;

    const name = this.deckName.trim() || 'deck';

    const grouped = cards.reduce<Record<string, { count: number; card: IPokemon }>>((acc, card) => {
      if (acc[card.id]) {
        acc[card.id].count++;
      } else {
        acc[card.id] = { count: 1, card };
      }
      return acc;
    }, {});

    const lines = [
      `Deck: ${name}`,
      `Cards: ${cards.length}/20`,
      '',
      ...Object.values(grouped).map(({ count, card }) =>
        `${count}x ${card.name} (${card.id})`
      )
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  loadDeck(deck: IDeck): void {
    this.clearDeck();
    this.deckName = deck.name;
    deck.cards.forEach((light: ILightPokemon) => {
      const asIPokemon = light as unknown as IPokemon;
      const count = this.cardCounts.get(light.id) || 0;
      if (count >= 2) return;
      const emptyIndex = this.deckSlots.findIndex(s => s === null);
      if (emptyIndex === -1) return;
      this.deckSlots[emptyIndex] = asIPokemon;
      this.cardCounts.set(light.id, count + 1);
    });
    this.activeTab.set('cards');
  }

  async deleteDeck(deckId: string): Promise<void> {
    await this.usersService.deleteDeck(deckId);
  }

  async saveDeck(): Promise<void> {
    const name = this.deckName.trim();
    if (!name) {
      this.saveMessage.set('Inserisci un nome per il mazzo!');
      this.saveStatus.set('error');
      setTimeout(() => this.saveStatus.set('idle'), 3000);
      return;
    }
    const cards = this.deckSlots.filter((s): s is IPokemon => s !== null);
    if (cards.length === 0) {
      this.saveMessage.set('Il mazzo è vuoto!');
      this.saveStatus.set('error');
      setTimeout(() => this.saveStatus.set('idle'), 3000);
      return;
    }

    try {
      this.saveStatus.set('saving');
      await this.usersService.saveDeck(name, cards);
      this.saveMessage.set(`Mazzo "${name}" salvato!`);
      this.saveStatus.set('saved');
    } catch (e) {
      this.saveMessage.set('Errore durante il salvataggio.');
      this.saveStatus.set('error');
    } finally {
      setTimeout(() => this.saveStatus.set('idle'), 3000);
    }
  }
}
