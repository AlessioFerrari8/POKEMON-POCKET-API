import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../services/users-service';

@Component({
  selector: 'app-settings',
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings {
  private usersService = inject(UsersService);

  private initializedFromUser = false;

  nickname = '';

  isSavingNickname = signal(false);

  successMessage = signal('');
  errorMessage = signal('');

  constructor() {
    effect(() => {
      const userData = this.usersService.userData();
      if (!userData || this.initializedFromUser) return;

      this.nickname = userData.nickname ?? userData.displayName ?? '';
      this.initializedFromUser = true;
    });
  }

  async saveNickname(): Promise<void> {
    this.errorMessage.set('');
    this.successMessage.set('');
    this.isSavingNickname.set(true);

    try {
      await this.usersService.updateNickname(this.nickname);
      this.successMessage.set('Nickname updated succesfuly.');
    } catch (error) {
      if (error instanceof Error && error.message) {
        this.errorMessage.set(error.message);
      } else {
        this.errorMessage.set('Operation not valid. Retry');
      }
    } finally {
      this.isSavingNickname.set(false);
    }
  }

}
