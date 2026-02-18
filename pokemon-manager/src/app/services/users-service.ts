import { Injectable, inject, signal, Signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import {
  Auth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User,
  setPersistence,
  browserLocalPersistence
} from '@angular/fire/auth';
import { IUser } from '../components/interfaces/i-user';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private auth = inject(Auth);
  private router = inject(Router);

  private _userData: WritableSignal<IUser | null> = signal<IUser | null>(null);
  userData: Signal<IUser | null> = this._userData.asReadonly();

  private _isLogged: WritableSignal<boolean> = signal(false);
  isLogged: Signal<boolean> = this._isLogged.asReadonly();

  private _loginError: WritableSignal<string> = signal('');
  loginError: Signal<string> = this._loginError.asReadonly();

  private _isLoading: WritableSignal<boolean> = signal(false);
  isLoading: Signal<boolean> = this._isLoading.asReadonly();

  private _isInitialized: WritableSignal<boolean> = signal(false);
  isInitialized: Signal<boolean> = this._isInitialized.asReadonly();

  constructor() {
    // Abilita la persistenza della sessione usando localStorage
    setPersistence(this.auth, browserLocalPersistence)
      .then(() => {
        console.log('✅ Persistenza Firebase abilitata');
        this.initAuthStateListener();
      })
      .catch((error) => {
        console.error('❌ Errore nell\'impostazione della persistenza:', error);
        // Procedi comunque anche se la persistenza fallisce
        this.initAuthStateListener();
      });
  }

  private initAuthStateListener(): void {
    console.log('🔍 Impostazione listener per i cambiamenti di auth state...');
    onAuthStateChanged(this.auth, (user: User | null) => {
      console.log('📡 Auth state changed - Utente:', user ? user.email : 'null');
      if (user) {
        console.log('✅ Utente loggato:', user.email);
        this.setUserData(user);
        // Se siamo sulla pagina di login e c'è un utente, naviga a home
        if (this.router.url === '/login') {
          console.log('🔄 Navigazione da login a home...');
          this.router.navigateByUrl('/home');
        }
      } else {
        console.log('ℹ️ Nessun utente loggato');
        this._userData.set(null);
        this._isLogged.set(false);
      }
      this._isInitialized.set(true);
    });
  }

  private setUserData(user: User): void {
    this._userData.set({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    });
    this._isLogged.set(true);
    this._loginError.set('');
  }

  loginWithGoogle(): void {
    this._isLoading.set(true);
    this._loginError.set('');
    console.log('🔐 Inizio del login con Google...');

    const provider = new GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    
    signInWithPopup(this.auth, provider)
      .then((result) => {
        console.log('✅ Login completato per:', result.user.email);
        this.setUserData(result.user);
        this._isLoading.set(false);
      })
      .catch((error) => {
        console.error('❌ Errore di login:', error);
        this._loginError.set(error.message || 'Errore durante il login. Assicurati che i domini autorizzati siano configurati in Firebase.');
        this._isLoading.set(false);
        this._isInitialized.set(true);
      });
  }

  logout(): void {
    this._isLoading.set(true);
    
    signOut(this.auth)
      .then(() => {
        this._isLogged.set(false);
        this._userData.set(null);
        this._loginError.set('');
        this.router.navigateByUrl('/login');
      })
      .catch((error) => {
        console.error('Errore di logout:', error);
        this._loginError.set(error.message || 'Errore durante il logout');
      })
      .finally(() => {
        this._isLoading.set(false);
      });
  }
}
