import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../services/users-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private usersService = inject(UsersService);

  isLoading = this.usersService.isLoading;
  loginError = this.usersService.loginError;

  loginWithGoogle(): void {
    this.usersService.loginWithGoogle();
  }
}
