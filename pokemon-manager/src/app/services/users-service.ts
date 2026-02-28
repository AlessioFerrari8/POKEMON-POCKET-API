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
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { IUser } from '../components/interfaces/i-user';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  // auth + routing
  private auth = inject(Auth);
  private router = inject(Router);
  private firestore = inject(Firestore);

  // variables for managin user
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
    // browserLocalPersistence è già il default per Firebase web, non serve setPersistence
    this.initAuthStateListener();
  }

  // TODO: use Observable instead of Promises
  private async setUserData(user: User): Promise<void> {
    const userAppData: IUser = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    };
    // update signal
    this._userData.set(userAppData);
    this._isLogged.set(true);
    this._loginError.set('');

    // sinc con Firestore
    await this.syncUserToFirestore(userAppData);
  }

  private async syncUserToFirestore(userData: IUser): Promise<void> {
    const userDocRef = doc(this.firestore, `users/${userData.uid}`);
    
    try {
      // setDoc con { merge: true }
      // utente non esiste, lo crea, se esiste aggiorna solo i campi cambiati
      // senza sovrascrivere eventuali altri dati
      await setDoc(userDocRef, { 
        ...userData, 
        lastLogin: new Date() 
      }, { merge: true });
      
      console.log('Sync Firestore completato');
    } catch (error) {
      console.error('Errore durante il sync Firestore:', error);
    }
  } 

  private initAuthStateListener(): void {
    console.log('Impostazione listener per i cambiamenti di auth state...');
    onAuthStateChanged(this.auth, async (user: User | null) => {
      console.log('Auth state changed - Utente:', user ? user.email : 'null');
      if (user) {
        await this.saveUserToFirestore(user); // salvo o aggiorno firestore
        await this.fetchAndSetUserData(user);
        console.log('Utente loggato:', user.email);
        this.setUserData(user);
        // Se siamo sulla pagina di login e c'è un utente, naviga a home
        if (this.router.url === '/login') {
          this.router.navigateByUrl('/home');
        }
      } else {
        console.log('ℹNessun utente loggato');
        this._userData.set(null);
        this._isLogged.set(false);
      }
      this._isInitialized.set(true);
    });
  }

  // scrittura su firestore
  private async saveUserToFirestore(user: User): Promise<void> {
    const userRef = doc(this.firestore, `users/${user.uid}`);
    
    // Usiamo setDoc con merge: true
    // Questo crea il documento se manca, o lo aggiorna se esiste
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    }, { merge: true });
  }

  // Funzione per leggere i dati da Firestore e aggiornare i Signals
  private async fetchAndSetUserData(user: User): Promise<void> {
    const userRef = doc(this.firestore, `users/${user.uid}`);
    const snap = await getDoc(userRef);
    
    if (snap.exists()) {
      const data = snap.data();
      this._userData.set({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        // Qui prendiamo i dati specifici che hai creato su Firestore
        cardsOwnedCount: data['cardsOwnedCount'] || 0,
        missingCards: data['missingCards'] || []
      });
      this._isLogged.set(true);
    }
  }

  // private setUserData(user: User): void {
  //   this._userData.set({
  //     uid: user.uid,
  //     email: user.email,
  //     displayName: user.displayName,
  //     photoURL: user.photoURL,
  //     emailVerified: user.emailVerified
  //   });
  //   this._isLogged.set(true);
  //   this._loginError.set('');
  // }

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
