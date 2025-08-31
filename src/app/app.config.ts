import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

import { HttpClientModule } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { provideIndexedDb } from 'ngx-indexed-db';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    importProvidersFrom(HttpClientModule),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideIndexedDb({
      name: 'BgDb',
      version: 2,
      objectStoresMeta: [
        {
          store: 'offreEmploi',
          storeConfig: { keyPath: 'id', autoIncrement: true },
          storeSchema: [
            { name: 'texteLettre', keypath: 'texteLettre', options: { unique: false } },
            { name: 'prompt', keypath: 'prompt', options: { unique: false } },
            { name: 'offreEmploi', keypath: 'offreEmploi', options: { unique: false } },
            { name: 'cvId', keypath: 'cvId', options: { unique: false } },
          ],
        },
      ],
    }),
  ],
};

const firebaseConfig = {
  apiKey: "AIzaSyDJzX17ZYTg2PuGnKtpDVgUCdWq4ml4ed4",
  authDomain: "job4you-78ed0.firebaseapp.com",
  projectId: "job4you-78ed0",
  storageBucket: "job4you-78ed0.firebasestorage.app",
  messagingSenderId: "1013830562564",
  appId: "1:1013830562564:web:688ea2826cdb3d8f23d651",
  measurementId: "G-R6SWXKQ8R5"
};

