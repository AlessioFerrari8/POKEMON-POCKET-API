import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Router, CanActivateFn } from '@angular/router';
import { UsersService } from '../services/users-service';
import { filter, map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const usersService = inject(UsersService);
  const router = inject(Router);

  // Se già inizializzato, check immediatamente
  if (usersService.isInitialized()) {
    if (usersService.isLogged()) {
      return true;
    } else {
      router.navigateByUrl('/login');
      return false;
    }
  }

  // Se non inizializzato, aspetta che `isInitialized` diventi true
  return toObservable(usersService.isInitialized).pipe(
    filter(initialized => initialized === true), // Aspetta che diventi true
    take(1),
    map(() => {
      // Dopo l'inizializzazione, controlla se loggato
      if (usersService.isLogged()) {
        return true;
      } else {
        router.navigateByUrl('/login');
        return false;
      }
    })
  );
};
