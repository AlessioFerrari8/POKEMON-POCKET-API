import { Injectable } from '@angular/core';
import TCGdex from '@tcgdex/sdk'

@Injectable({
  providedIn: 'root',
})

export class PokemonSDK {
  private tcgdex: TCGdex; 
  
  constructor() {
    this.tcgdex = new TCGdex('en');
  }

  async getCards() {
    try {
      // recupera tutte le carte
      const cards = await this.tcgdex.fetch('cards');
      return cards;
    } catch (error) {
      console.error('Errore nel fetch delle carte:', error);
      return [];
    }
  }

  async searchCards(query: string) {
    try {
      const cards = await this.tcgdex.fetch('cards', query);
      return cards;
    } catch (error) {
      console.error('Errore nella ricerca:', error);
      return [];
    }
  }

  async getCard(id: string) {
    try {
      return await this.tcgdex.fetch('cards', id);
    } catch (error) {
      console.error('Errore nel recupero della carta:', error);
      return null;
    }
  }
}
