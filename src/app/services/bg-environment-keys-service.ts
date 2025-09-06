import { ApplicationConfig, APP_INITIALIZER } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class KeysService {
  private keys: any = null;
  private readonly url =
    'https://europe-west1-job4you-78ed0.cloudfunctions.net/keys';

  constructor(private http: HttpClient) {

  }

  async loadKeys(): Promise<void> {
    console.log('loadKeys start:');
    try {
      this.keys = await firstValueFrom(this.http.get(this.url));
      console.log('Keys loaded:', this.keys);
    } catch (error: any) {
      console.error('Error loading keys:', error);
    }
  }

  getKeys(): any {
    return this.keys;
  }
}
