import { ApplicationConfig, provideBrowserGlobalErrorListeners, APP_INITIALIZER, ErrorHandler } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';

import { routes } from './app.routes';
import { environment } from '../environments/environment';

class CorsErrorHandler implements ErrorHandler {
  handleError(error: Error): void {
    if (error.message?.includes('Cross-Origin') || error.message?.includes('window.closed')) {
      console.warn('CORS error handled:', error);
      return;
    }
    console.error(error);
  }
}

const loadConfig = (http: HttpClient) => () => {
  return http.get<any>(environment.configUrl).toPromise().then(config => {
    if (config) {
      environment.firebase = config.firebase;
    }
  }).catch(err => {
    console.error('Errore nel caricamento di config.json:', err);
  });
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    {
      provide: ErrorHandler,
      useClass: CorsErrorHandler
    },
    {
      provide: APP_INITIALIZER,
      useFactory: loadConfig,
      deps: [HttpClient],
      multi: true
    },
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth())
  ]
};
