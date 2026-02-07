import { Injectable, inject, signal, Signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import {
  Auth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User
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

  private _loginError: WritableSignal<boolean> = signal(false);
  loginError: Signal<boolean> = this._loginError.asReadonly();

  private _isLoading: WritableSignal<boolean> = signal(false);
  isLoading: Signal<boolean> = this._isLoading.asReadonly();

  private _isInitialized: WritableSignal<boolean> = signal(false);
  isInitialized: Signal<boolean> = this._isInitialized.asReadonly();

  constructor() {
    this.initAuthStateListener();
  }

  private initAuthStateListener(): void {
    onAuthStateChanged(this.auth, (user: User | null) => {
      if (user) {
        this._userData.set({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified
        });
        this._isLogged.set(true);
        this._loginError.set(false);
      } else {
        this._userData.set(null);
        this._isLogged.set(false);
      }
      this._isInitialized.set(true);
    });
  }

  loginWithGoogle(): void {
    this._isLoading.set(true);
    this._loginError.set(false);

    const provider = new GoogleAuthProvider();
    
    signInWithPopup(this.auth, provider)
      .then((result) => {
        const user = result.user;
        this._userData.set({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified
        });
        this._isLogged.set(true);
        this._isInitialized.set(true);
        this._loginError.set(false);
        this.router.navigateByUrl('/');
      })
      .catch((error) => {
        console.error('Login error:', error);
        this._loginError.set(true);
        this._isInitialized.set(true);
      })
      .finally(() => {
        this._isLoading.set(false);
      });
  }

  logout(): void {
    this._isLoading.set(true);
    
    signOut(this.auth)
      .then(() => {
        this._isLogged.set(false);
        this._userData.set(null);
        this._loginError.set(false);
        this.router.navigateByUrl('/login');
      })
      .catch((error) => {
        console.error('Logout error:', error);
        this._loginError.set(true);
      })
      .finally(() => {
        this._isLoading.set(false);
      });
  }
}
