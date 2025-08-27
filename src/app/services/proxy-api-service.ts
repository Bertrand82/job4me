import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ProxyApiService {
  // Remplace cette URL par l'URL de ta Cloud Function déployée
  private proxyUrl = 'https://<YOUR_REGION>-<YOUR_PROJECT_ID>.cloudfunctions.net/proxyToDynamicUrl';

  constructor(private http: HttpClient) {}

  /**
   * Fait une requête GET à l'URL cible via le proxy Cloud Function
   * @param targetUrl L'URL distante à atteindre
   */
  getViaProxy<T>(targetUrl: string): Observable<T> {
    const params = new HttpParams().set('url', targetUrl);
    return this.http.get<T>(this.proxyUrl, { params });
  }
}
