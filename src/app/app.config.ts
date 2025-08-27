import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
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
      version: 1,
      objectStoresMeta: [
        {
          store: 'people',
          storeConfig: { keyPath: 'id', autoIncrement: true },
          storeSchema: [
            { name: 'name', keypath: 'name', options: { unique: false } }
          ]
        }
      ]
    })
  ]
};


