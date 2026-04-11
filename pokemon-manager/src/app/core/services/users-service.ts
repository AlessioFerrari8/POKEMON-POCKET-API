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
import { Firestore, doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove, increment } from '@angular/fire/firestore';
import { AppLanguage, IUser } from '../../shared/components/interfaces/i-user';
import { IPokemon } from '../../shared/components/interfaces/i-pokemon';
import { ILightPokemon } from '../../shared/components/interfaces/i-light-pokemon';
import { IDeck } from '../../shared/components/interfaces/i-deck';
import { StorageService } from './storage-service';
import { STORAGE_KEYS, ROUTES, DEFAULTS, ERROR_MESSAGES } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  // auth + routing
  private auth = inject(Auth);
  private router = inject(Router);
  private firestore = inject(Firestore);
  private storage = inject(StorageService);

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
    // prima ripristino poi listener
    const savedGuest = this.storage.getItem<IUser>(STORAGE_KEYS.GUEST_USER);
    if (savedGuest) {
      try {
        this._userData.set(savedGuest);
        this._isLogged.set(true);
      } catch (error) {
        console.error('Errore', error);
        this.storage.removeItem(STORAGE_KEYS.GUEST_USER);
      }
    }


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
        // Se siamo sulla pagina di login e c'è un utente, naviga a home
        if (this.router.url === `/${ROUTES.LOGIN}`) {
          this.router.navigateByUrl(`/${ROUTES.HOME}`);
        }
      } else {
        const savedUser = this.storage.getItem(STORAGE_KEYS.GUEST_USER)
        if (!savedUser) {
          this._userData.set(null)
          this._isLogged.set(false);
        }
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
      const nickname = typeof data['nickname'] === 'string' ? data['nickname'] : null;
      const language: AppLanguage = data['settings']?.language === 'en' ? 'en' : 'it';
      const useGoogleTranslate = Boolean(data['settings']?.useGoogleTranslate);

      this._userData.set({
        uid: user.uid,
        email: user.email,
        displayName: nickname ?? data['displayName'] ?? user.displayName,
        nickname,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        // Qui prendiamo i dati specifici che hai creato su Firestore
        cardsOwnedCount: data['cardsOwnedCount'] || 0,
        ownedCards: data['ownedCards'] || [],
        missingCards: data['missingCards'] || [],
        decks: data['decks'] || [],
        settings: {
          language,
          useGoogleTranslate
        }
      });
      this._isLogged.set(true);
    }
  }

  async updateNickname(newNickname: string): Promise<void> {
    const user = this._userData();
    if (!user) throw new Error(ERROR_MESSAGES.USER_NOT_AUTHENTICATED);

    const normalized = newNickname.trim();
    if (normalized.length < DEFAULTS.NICKNAME_MIN_LENGTH || normalized.length > DEFAULTS.NICKNAME_MAX_LENGTH) {
      throw new Error(ERROR_MESSAGES.INVALID_NICKNAME);
    }

    const userRef = doc(this.firestore, `users/${user.uid}`);
    await updateDoc(userRef, {
      nickname: normalized,
      displayName: normalized
    });

    this._userData.set({
      ...user,
      nickname: normalized,
      displayName: normalized
    });
  }

  async updatePokemonId(newPokemonId: string): Promise<void> {
    const user = this._userData();
    if (!user) throw new Error(ERROR_MESSAGES.USER_NOT_AUTHENTICATED);

    const normalized = newPokemonId.trim();
    if (normalized.length != DEFAULTS.POKEMON_ID_LENGTH) {
      throw new Error(ERROR_MESSAGES.INVALID_POKEMON_ID);
    }

    const userRef = doc(this.firestore, `users/${user.uid}`);
    await updateDoc(userRef, {
      pid: normalized
    });

    this._userData.set({
      ...user,
      pid: normalized
    });
  }

  // not used - AI generated
  async updateLanguage(language: AppLanguage): Promise<void> {
    const user = this._userData();
    if (!user) throw new Error(ERROR_MESSAGES.USER_NOT_AUTHENTICATED);

    const normalizedLanguage: AppLanguage = language === 'en' ? 'en' : 'it';
    const updatedSettings = {
      language: normalizedLanguage,
      useGoogleTranslate: user.settings?.useGoogleTranslate ?? false
    };

    const userRef = doc(this.firestore, `users/${user.uid}`);
    await updateDoc(userRef, { settings: updatedSettings });
    this._userData.set({ ...user, settings: updatedSettings });
  }

  async updateGoogleTranslatePreference(enabled: boolean): Promise<void> {
    const user = this._userData();
    if (!user) throw new Error(ERROR_MESSAGES.USER_NOT_AUTHENTICATED);

    const updatedSettings = {
      language: user.settings?.language ?? 'it',
      useGoogleTranslate: enabled
    };

    const userRef = doc(this.firestore, `users/${user.uid}`);
    await updateDoc(userRef, { settings: updatedSettings });
    this._userData.set({ ...user, settings: updatedSettings });
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

  isCardOwned(cardId: string): boolean {
    return this._userData()?.ownedCards?.includes(cardId) ?? false;
  }

  isCardMissing(cardId: string): boolean {
    return this._userData()?.missingCards?.some(c => c.id === cardId) ?? false;
  }

  private persistGuestIfNeeded(): void {
    const user = this._userData();
    if (user?.uid.startsWith('guest')) {
      this.storage.setItem(STORAGE_KEYS.GUEST_USER, user);
    }
  }

  async toggleMissingCard(card: IPokemon): Promise<void> {
    const user = this._userData();
    if (!user) return;

    const currentMissing: ILightPokemon[] = user.missingCards ?? [];
    const alreadyMissing = this.isCardMissing(card.id);
    let updatedMissing: ILightPokemon[];

    if (alreadyMissing) {
      updatedMissing = currentMissing.filter(c => c.id !== card.id);
    } else {
      // Estrae il setId dall'URL dell'immagine se non è già presente
      let setId = card.set?.id || '';
      if (!setId && card.image) {
        const parts = card.image.split('/');
        setId = parts[parts.length - 2] || '';
      }

      const lightCard: ILightPokemon = {
        id: card.id,
        name: card.name ?? '',
        image: card.image ?? '',
        localId: card.localId ?? '',
        category: card.category ?? '',
        illustrator: card.illustrator ?? '',
        rarity: card.rarity ?? '',
        set: {
          id: setId,
          name: card.set?.name || '',
          logo: card.set?.logo || '',
          symbol: card.set?.symbol || '',
          cardCount: card.set?.cardCount || { official: 0, total: 0 }
        },
        dexId: card.dexId ?? [],
        hp: card.hp ?? 0,
        types: card.types ?? [],
        stage: card.stage ?? ''
      };
      updatedMissing = [...currentMissing, lightCard];
    }
    this._userData.set({ ...user, missingCards: updatedMissing });

    if (!user.uid.startsWith('guest')) {
      const userRef = doc(this.firestore, `users/${user.uid}`);
      await updateDoc(userRef, { missingCards: updatedMissing });
    }

    this.persistGuestIfNeeded();

  }

  async toggleCardOwned(cardId: string): Promise<void> {
    const user = this._userData();
    if (!user) return;

    const owned = this.isCardOwned(cardId);
    const updatedOwned = owned
      ? (user.ownedCards ?? []).filter(id => id !== cardId)
      : [...(user.ownedCards ?? []), cardId];
    const updatedCount = (user.cardsOwnedCount ?? 0) + (owned ? -1 : 1);

    this._userData.set({ ...user, ownedCards: updatedOwned, cardsOwnedCount: updatedCount });

    if (!user.uid.startsWith('guest')) {
      const userRef = doc(this.firestore, `users/${user.uid}`);
      await updateDoc(userRef, {
        ownedCards: owned ? arrayRemove(cardId) : arrayUnion(cardId),
        cardsOwnedCount: increment(owned ? -1 : 1)
      });
    }

    this.persistGuestIfNeeded();
  }

  async deleteDeck(deckId: string): Promise<void> {
    const user = this._userData();
    if (!user) return;

    const updatedDecks = (user.decks ?? []).filter(d => d.id !== deckId);
    this._userData.set({ ...user, decks: updatedDecks });

    if (!user.uid.startsWith('guest')) {
      const userRef = doc(this.firestore, `users/${user.uid}`);
      await updateDoc(userRef, { decks: updatedDecks });
    }

    this.persistGuestIfNeeded();
  }


  async saveDeck(name: string, cards: IPokemon[]): Promise<void> {
    const user = this._userData();
    if (!user) throw new Error(ERROR_MESSAGES.USER_NOT_AUTHENTICATED);

    const lightCards: ILightPokemon[] = cards
      .filter(c => c !== null)
      .map(c => ({
        id: c.id,
        name: c.name ?? '',
        image: c.image ?? '',
        localId: c.localId ?? '',
        category: c.category ?? '',
        illustrator: c.illustrator ?? '',
        rarity: c.rarity ?? '',
        set: c.set ?? { id: '', name: '', logo: '', symbol: '', cardCount: { official: 0, total: 0 } },
        dexId: c.dexId ?? [],
        hp: c.hp ?? 0,
        types: c.types ?? [],
        stage: c.stage ?? ''
      }));

    const now = new Date().toISOString();
    const existingDecks: IDeck[] = user.decks ?? [];
    const existingIndex = existingDecks.findIndex(d => d.name === name);

    let updatedDecks: IDeck[];

    if (existingIndex >= 0) {
      // aggiorna deck esistente
      updatedDecks = existingDecks.map((d, i) =>
        i === existingIndex ? { ...d, cards: lightCards, updatedAt: now } : d
      );
    } else {
      // crea nuovo deck
      const newDeck: IDeck = {
        id: crypto.randomUUID(),
        name,
        cards: lightCards,
        createdAt: now,
        updatedAt: now
      };
      updatedDecks = [...existingDecks, newDeck];
    }

    this._userData.set({ ...user, decks: updatedDecks });

    if (!user.uid.startsWith('guest')) {
      const userRef = doc(this.firestore, `users/${user.uid}`);
      await updateDoc(userRef, { decks: updatedDecks });
    }

    this.persistGuestIfNeeded();

  }

  loginAsAGuest(): void { // no salvataggio su firestore
    this._isLoading.set(true);
    this._loginError.set('');
    console.log('👤 Inizio del login come guest...');

    try {
    const guestUid = `guest_${crypto.randomUUID()}`;
    const guestUser: IUser = {
      uid: guestUid,
      email: null,
      displayName: 'Guest',
      photoURL: null,
      emailVerified: false,
      cardsOwnedCount: 0,
      ownedCards: [],
      missingCards: [],
      decks: [],
      settings: {
        language: 'it',
        useGoogleTranslate: false
      }
    };

      this._userData.set(guestUser);
      this._isLogged.set(true);
      this._isLoading.set(false);
      
      // uso localstorage per salvare
      this.storage.setItem(STORAGE_KEYS.GUEST_USER, guestUser);
      
      console.log('✅ Login guest completato');
      this.router.navigateByUrl(`/${ROUTES.HOME}`);
    } catch (error) {
      console.error('❌ Errore login guest:', error);
      this._loginError.set(ERROR_MESSAGES.GUEST_LOGIN_ERROR);
      this._isLoading.set(false);
      this._isInitialized.set(true);
    }
    
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
        this.storage.setItem(STORAGE_KEYS.LAST_USER, { // salvo l'ultimo user
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName
        });
        this._isLoading.set(false);
      })
      .catch((error) => {
        console.error('❌ Errore di login:', error);
        this._loginError.set(error.message || ERROR_MESSAGES.LOGIN_ERROR);
        this._isLoading.set(false);
        this._isInitialized.set(true);
      });
  }

  logout(): void {
    this._isLoading.set(true);

    // pulizia guest
    this.storage.removeItem(STORAGE_KEYS.GUEST_USER);
    this.storage.removeItem(STORAGE_KEYS.LAST_USER);
    
    signOut(this.auth)
      .then(() => {
        this._isLogged.set(false);
        this._userData.set(null);
        this._loginError.set('');
        this.router.navigateByUrl(`/${ROUTES.LOGIN}`);
      })
      .catch((error) => {
        console.error('Errore di logout:', error);
        this._loginError.set(error.message || ERROR_MESSAGES.LOGOUT_ERROR);
      })
      .finally(() => {
        this._isLoading.set(false);
      });
  }
}
