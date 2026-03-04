import { Component, inject, computed, Signal } from '@angular/core';
import { UsersService } from '../../services/users-service';

@Component({
  selector: 'app-user-profile',
  imports: [],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css',
})
export class UserProfile {
  private usersService = inject(UsersService);

  displayName: Signal<string | null | undefined> = computed(() => this.usersService.userData()?.displayName);
  photoURL: Signal<string | null | undefined> = computed(() => this.usersService.userData()?.photoURL);
  email: Signal<string | null | undefined> = computed(() => this.usersService.userData()?.email);

  cardsOwned: Signal<number> = computed(() => this.usersService.userData()?.cardsOwnedCount ?? 0);
  decksCount: Signal<number> = computed(() => this.usersService.userData()?.decks?.length ?? 0);
  missingCardsCount: Signal<number> = computed(() => this.usersService.userData()?.missingCards?.length ?? 0);

  onImageError(): void {
    console.warn('Failed to load profile image');
  }
}

