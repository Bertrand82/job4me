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
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    importProvidersFrom(HttpClientModule),
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
