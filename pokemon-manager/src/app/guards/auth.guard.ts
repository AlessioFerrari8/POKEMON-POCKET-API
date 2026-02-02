import { Injectable, inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { UsersService } from '../services/users-service';

export const authGuard: CanActivateFn = (route, state) => {
  const usersService = inject(UsersService);
  const router = inject(Router);

  if (usersService.isLogged()) {
    return true;
  } else {
    router.navigateByUrl('/login');
    return false;
  }
};
