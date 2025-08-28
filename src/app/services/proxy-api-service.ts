import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ProxyApiService {
  private projectId = 'job4you-78ed0';
  private host="xx"   ;

  // Remplace cette URL par l'URL de ta Cloud Function déployée
  private proxyUrl_ = 'https://<YOUR_REGION>-<YOUR_PROJECT_ID>.cloudfunctions.net/proxyToDynamicUrl';
  // https://proxytodynamicurl-qwoyh7pmvq-ew.a.run.app/?url=http://lemonde.fr
  constructor(private http: HttpClient) {
    const baseUrl0 = window.location.origin;
    this.host =  window.location.host;
    const REGION = 'europe-west1';


    this.proxyUrl_ = `https://${REGION}-${this.projectId}.cloudfunctions.net/proxyToDynamicUrl`;
  }

  /**
   * Fait une requête GET à l'URL cible via le proxy Cloud Function
   * @param targetUrl L'URL distante à atteindre
   */
  getViaProxy<T>(targetUrl: string): Observable<T> {
    console.log('projectId', this.projectId);
    console.log('host', this.host);
    console.log('proxyUrl_', this.proxyUrl_);
    const params = new HttpParams().set("url", targetUrl);
    console.log('params', params);
    return this.http.get<T>(this.proxyUrl_, { params });
  }
}
