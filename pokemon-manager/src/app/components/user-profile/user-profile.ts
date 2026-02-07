import { Component, inject, signal, WritableSignal } from '@angular/core';
import { UsersService } from '../../services/users-service';
import { IUser } from '../interfaces/i-user';

@Component({
  selector: 'app-user-profile',
  imports: [],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css',
})
export class UserProfile {
  private _usersService = inject(UsersService);
  displayName: WritableSignal<string | null | undefined> = signal(this._usersService.userData()?.displayName);
  photoURL: WritableSignal<string | null> = signal(this._usersService.userData()?.photoURL ?? null);
  email: WritableSignal<string | null | undefined> = signal(this._usersService.userData()?.email);

  onImageError(): void {
    console.warn('Failed to load image from:', this.photoURL());
  }
}
