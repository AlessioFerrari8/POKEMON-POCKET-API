import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';

import { Settings } from './settings';
import { UsersService } from '../../services/users-service';
import { IUser } from '../interfaces/i-user';

describe('Settings', () => {
  let component: Settings;
  let fixture: ComponentFixture<Settings>;

  const mockUser = signal<IUser | null>({
    uid: 'test-user-id',
    email: 'test@example.com',
    displayName: 'Test User',
    nickname: 'Test User',
    photoURL: null,
    emailVerified: true,
    settings: {
      language: 'it',
      useGoogleTranslate: false
    }
  });

  const usersServiceMock = {
    userData: mockUser.asReadonly(),
    updateNickname: async () => Promise.resolve(),
    updateLanguage: async () => Promise.resolve(),
    updateGoogleTranslatePreference: async () => Promise.resolve()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Settings],
      providers: [{ provide: UsersService, useValue: usersServiceMock }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Settings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
