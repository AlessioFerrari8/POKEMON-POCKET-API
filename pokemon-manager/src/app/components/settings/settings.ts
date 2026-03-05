import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppLanguage } from '../interfaces/i-user';
import { UsersService } from '../../services/users-service';

type TranslationKey =
  | 'title'
  | 'subtitle'
  | 'nicknameLabel'
  | 'nicknameHint'
  | 'nicknameAction'
  | 'languageLabel'
  | 'languageHint'
  | 'italian'
  | 'english'
  | 'languageAction'
  | 'translateToggleLabel'
  | 'translateToggleHint'
  | 'translateAction'
  | 'saving'
  | 'nicknameSaved'
  | 'languageSaved'
  | 'translatePrefSaved'
  | 'genericError';

@Component({
  selector: 'app-settings',
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings {
  private usersService = inject(UsersService);

  private initializedFromUser = false;

  language: AppLanguage = 'it';
  nickname = '';
  useGoogleTranslate = false;

  isSavingNickname = signal(false);
  isSavingLanguage = signal(false);
  isSavingTranslatePreference = signal(false);

  successMessage = signal('');
  errorMessage = signal('');

  private labels: Record<AppLanguage, Record<TranslationKey, string>> = {
    it: {
      title: 'Impostazioni Account',
      subtitle: 'Gestisci lingua e nickname del profilo.',
      nicknameLabel: 'Nickname',
      nicknameHint: 'Minimo 2 caratteri, massimo 24.',
      nicknameAction: 'Salva nickname',
      languageLabel: 'Lingua applicazione',
      languageHint: 'Preferenza salvata nel tuo profilo Firestore.',
      italian: 'Italiano',
      english: 'Inglese',
      languageAction: 'Salva lingua',
      translateToggleLabel: 'Abilita supporto Google Translate',
      translateToggleHint: 'Se attivo, puoi aprire la pagina corrente tradotta automaticamente.',
      translateAction: 'Apri pagina tradotta',
      saving: 'Salvataggio...',
      nicknameSaved: 'Nickname aggiornato con successo.',
      languageSaved: 'Lingua aggiornata con successo.',
      translatePrefSaved: 'Preferenza Google Translate salvata.',
      genericError: 'Operazione non riuscita. Riprova tra poco.'
    },
    en: {
      title: 'Account Settings',
      subtitle: 'Manage your profile language and nickname.',
      nicknameLabel: 'Nickname',
      nicknameHint: 'At least 2 characters, up to 24.',
      nicknameAction: 'Save nickname',
      languageLabel: 'Application language',
      languageHint: 'Preference stored in your Firestore profile.',
      italian: 'Italian',
      english: 'English',
      languageAction: 'Save language',
      translateToggleLabel: 'Enable Google Translate support',
      translateToggleHint: 'When enabled, you can open the current page translated automatically.',
      translateAction: 'Open translated page',
      saving: 'Saving...',
      nicknameSaved: 'Nickname updated successfully.',
      languageSaved: 'Language updated successfully.',
      translatePrefSaved: 'Google Translate preference saved.',
      genericError: 'Operation failed. Please try again shortly.'
    }
  };

  constructor() {
    effect(() => {
      const userData = this.usersService.userData();
      if (!userData || this.initializedFromUser) return;

      this.nickname = userData.nickname ?? userData.displayName ?? '';
      this.language = userData.settings?.language ?? 'it';
      this.useGoogleTranslate = userData.settings?.useGoogleTranslate ?? false;
      this.initializedFromUser = true;
    });
  }

  t(key: TranslationKey): string {
    return this.labels[this.language][key];
  }

  async saveNickname(): Promise<void> {
    this.errorMessage.set('');
    this.successMessage.set('');
    this.isSavingNickname.set(true);

    try {
      await this.usersService.updateNickname(this.nickname);
      this.successMessage.set(this.t('nicknameSaved'));
    } catch (error) {
      if (error instanceof Error && error.message) {
        this.errorMessage.set(error.message);
      } else {
        this.errorMessage.set(this.t('genericError'));
      }
    } finally {
      this.isSavingNickname.set(false);
    }
  }

  async saveLanguage(): Promise<void> {
    this.errorMessage.set('');
    this.successMessage.set('');
    this.isSavingLanguage.set(true);

    try {
      await this.usersService.updateLanguage(this.language);
      this.successMessage.set(this.t('languageSaved'));
    } catch {
      this.errorMessage.set(this.t('genericError'));
    } finally {
      this.isSavingLanguage.set(false);
    }
  }

  async onGoogleTranslateToggle(): Promise<void> {
    this.errorMessage.set('');
    this.successMessage.set('');
    this.isSavingTranslatePreference.set(true);

    try {
      await this.usersService.updateGoogleTranslatePreference(this.useGoogleTranslate);
      this.successMessage.set(this.t('translatePrefSaved'));
    } catch {
      this.errorMessage.set(this.t('genericError'));
    } finally {
      this.isSavingTranslatePreference.set(false);
    }
  }

  openGoogleTranslate(): void {
    const sourceLanguage = this.language === 'en' ? 'it' : 'en';
    const targetLanguage = this.language;
    const currentUrl = encodeURIComponent(window.location.href);
    const translateUrl = `https://translate.google.com/translate?sl=${sourceLanguage}&tl=${targetLanguage}&u=${currentUrl}`;

    window.open(translateUrl, '_blank', 'noopener,noreferrer');
  }

}
