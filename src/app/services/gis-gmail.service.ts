import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom, from, Observable, throwError } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { environment_secret } from '../environments/environment_secret';
@Injectable({ providedIn: 'root' })
export class GisGmailService {
  private tokenClient: any = null;
  private accessToken: string | null = null;
  private tokenExpiryTs = 0; // timestamp en ms
  public isSignedIn$ = new BehaviorSubject<boolean>(false);

  private readonly SCOPES = environment.gmailScopes;
  private readonly CLIENT_ID = environment_secret.googleClientId;

  constructor(private http: HttpClient) {
    this.initTokenClient();
  }

  /** Initialise le token client GIS. */
  private initTokenClient() {
    if (!window.google || !window.google.accounts || !window.google.accounts.oauth2) {
      console.warn('GIS client non chargé — assurez-vous d\'inclure https://accounts.google.com/gsi/client dans index.html');
      return;
    }
    console.log('bg00 Initialisation du token client GIS avec client ID=', this.CLIENT_ID);
    this.tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: this.CLIENT_ID,
      scope: this.SCOPES,
      // callback sera appelé lorsque requestAccessToken retourne un token (ou une erreur)
      callback: (resp: any) => {
        console.log('bg01 response de GIS token client:', resp);
        if (resp.error) {

          this.isSignedIn$.next(false);
          return;
        }
        this.accessToken = resp.access_token;
        // expires_in est en secondes
        this.tokenExpiryTs = Date.now() + (resp.expires_in ? resp.expires_in * 1000 : 0);
        this.isSignedIn$.next(true);
      }
    });
  }

  /** Démarre le flux d'authentification et récupère un access token.
   *  prompt peut être 'consent' pour forcer écran consentement la première fois,
   *  ou '' (vide) pour comportement silencieux si possible.
   */
  public  signIn(prompt: '' | 'consent' = 'consent'): Promise<void> {
    console.log('bg10 login GIS requested with prompt=', prompt);
    console.log('bg10 login tokenClient=', this.tokenClient);
    if (!this.tokenClient) {
      console.log('bg11 Initialisation du token client GIS...');
      this.initTokenClient();
      if (!this.tokenClient) {
        console.log('bg12 token reject...');
        return Promise.reject(new Error('bg03 Google Identity Services non initialisé.'));
      }
    }

    return new Promise<void>((resolve, reject) => {
      try {
         console.log('bg13 promise  created ', this.tokenClient);
        this.tokenClient.callback = (resp: any) => {
          console.log('bg14 token client callback called with resp=', resp);
          if (resp.error) {
            this.isSignedIn$.next(false);
            reject(resp);
            return;
          }
          this.accessToken = resp.access_token;
          this.tokenExpiryTs = Date.now() + (resp.expires_in ? resp.expires_in * 1000 : 0);
          this.isSignedIn$.next(true);
          console.log('bg13 resolve called');
          resolve();
        };

        // demande d'Access Token : ouvrira le popup UI de Google si besoin
        this.tokenClient.requestAccessToken({ prompt });
      } catch (err) {
        reject(err);
      }
    });
  }

  /** Révoque le token côté serveur Google et nettoie l'état local */
  public async signOut(): Promise<void> {
    if (!this.accessToken) {
      this.clearState();
      return;
    }

    try {
      const url = 'https://oauth2.googleapis.com/revoke';
      const params = new HttpParams().set('token', this.accessToken);
      await this.http.post(url, params.toString(), {
        headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
      }).toPromise();
    } catch (err) {
      // Même si la révocation échoue côté réseau, on nettoie l'état local
      console.warn('Révocation du token échouée', err);
    } finally {
      this.clearState();
    }
  }

  private clearState() {
    this.accessToken = null;
    this.tokenExpiryTs = 0;
    this.isSignedIn$.next(false);
  }

  /** Retourne un access token valide; si expiré, tente de rafraîchir via token client (silencieusement). */
  private ensureAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiryTs - 10000) {
      return Promise.resolve(this.accessToken);
    }

    if (!this.tokenClient) {
      this.initTokenClient();
      if (!this.tokenClient) {
        return Promise.reject(new Error('Token client non initialisé'));
      }
    }

    return new Promise<string>((resolve, reject) => {
      // callback temporaire pour récupérer le token rafraîchi
      this.tokenClient.callback = (resp: any) => {
        if (resp.error) {
          this.isSignedIn$.next(false);
          reject(resp);
          return;
        }
        this.accessToken = resp.access_token;
        this.tokenExpiryTs = Date.now() + (resp.expires_in ? resp.expires_in * 1000 : 0);
        this.isSignedIn$.next(true);
        resolve(this.accessToken as string);
      };

      try {
        // prompt vide => tentative silencieuse si Google a déjà autorisé
        this.tokenClient.requestAccessToken({ prompt: '' });
      } catch (err) {
        reject(err);
      }
    });
  }

  /** Helper pour ajouter header Authorization et faire GET */


  private async get<T>(url: string, params?: HttpParams): Promise<T> {
  const token = await this.ensureAccessToken();
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  const obs$ = this.http.get<T>(url, { headers, params }).pipe(
    // throwError now expects a factory: () => error
    catchError(err => throwError(() => err))
  );

  return firstValueFrom(obs$);
}

  // --- Gmail specific helpers ---

  /** Liste des messages (retourne uniquement les ids et threadId) */
  public async listMessages(maxResults = 20, q = ''): Promise<{ messages?: Array<{ id: string; threadId: string }>, resultSizeEstimate?: number }> {
    const params = new HttpParams()
      .set('maxResults', String(maxResults))
      .set('q', q || '');
    const url = 'https://gmail.googleapis.com/gmail/v1/users/me/messages';
    return this.get<{ messages?: Array<{ id: string; threadId: string }>, resultSizeEstimate?: number }>(url, params);
  }

  /** Récupère un message complet (format: 'full'|'metadata'|'minimal'|'raw') */
  public async getMessage(messageId: string, format: 'full' | 'metadata' | 'minimal' | 'raw' = 'full'): Promise<any> {
    const url = `https://gmail.googleapis.com/gmail/v1/users/me/messages/${encodeURIComponent(messageId)}`;
    const params = new HttpParams().set('format', format);
    return this.get<any>(url, params);
  }

  /** Récupère le profil du compte (adresse email) */
  public async getProfile(): Promise<{ emailAddress: string; messagesTotal: number; threadsTotal: number }> {
    const url = 'https://gmail.googleapis.com/gmail/v1/users/me/profile';
    return this.get<{ emailAddress: string; messagesTotal: number; threadsTotal: number }>(url);
  }
}
