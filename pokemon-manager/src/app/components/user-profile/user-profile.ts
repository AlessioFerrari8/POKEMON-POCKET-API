import { Component, inject, signal, WritableSignal, OnInit } from '@angular/core';
import { UsersService } from '../../services/users-service';
import { PokemonCollectionService } from '../../services/pokemon-collection-firestore.service';
import { PokemonSDK } from '../../services/pokemon-sdk';
import { IUser } from '../interfaces/i-user';

@Component({
  selector: 'app-user-profile',
  imports: [],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css',
})
export class UserProfile implements OnInit {
  private usersService = inject(UsersService);
  private pokemonCollectionService = inject(PokemonCollectionService);
  private pokemonSDK = inject(PokemonSDK);

  displayName: WritableSignal<string | null | undefined> = signal(this.usersService.userData()?.displayName);
  photoURL: WritableSignal<string | null> = signal(this.usersService.userData()?.photoURL ?? null);
  email: WritableSignal<string | null | undefined> = signal(this.usersService.userData()?.email);
  
  cardsOwned: WritableSignal<number> = signal(0);
  decksCount: WritableSignal<number> = signal(0);
  missingCardsCount: WritableSignal<number> = signal(0);

  ngOnInit() {
    // Carica le statistiche dell'utente
    this.loadUserStats();
  }

  private loadUserStats() {
    // Carica le carte possedute
    this.pokemonCollectionService.getUserCards().subscribe(cards => {
      this.cardsOwned.set(cards.length);
    });

    // Carica il numero di carte mancanti (ottiene tutte le carte e calcola)
    this.pokemonSDK.getCards('tcgp').subscribe(allCards => {
      this.pokemonCollectionService.getMissingCards(allCards).subscribe(missingCards => {
        this.missingCardsCount.set(missingCards.length);
      });
    });

    // TODO: Caricare i deck quando implementato
    this.decksCount.set(0);
  }

  onImageError(): void {
    console.warn('Failed to load image from:', this.photoURL());
  }
}

