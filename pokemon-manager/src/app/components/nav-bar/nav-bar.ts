import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';  
import { UsersService } from '../../services/users-service';


@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true
})

export class NavBar {
  usersService: UsersService = inject(UsersService);

  logout(): void {
    this.usersService.logout();
  }
}
