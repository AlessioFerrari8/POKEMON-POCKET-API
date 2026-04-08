import { Injectable, inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { UsersService } from '../services/users-service';

export const authGuard: CanActivateFn = (route, state) => {
  const usersService = inject(UsersService);
  const router = inject(Router);

  // Se non è inizializzato ancora, permetti il caricamento
  // (aspetta che Firebase finisca il controllo)
  if (!usersService.isInitialized()) {
    return true;
  }

  // Una volta inizializzato, controlla se loggato
  if (usersService.isLogged()) {
    return true;
  } else {
    router.navigateByUrl('/login');
    return false;
  }
};
