import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BgAuthService } from './bg-auth-service';

@Injectable({ providedIn: 'root' })
export class PostWithAuthService {
  constructor(private http: HttpClient, private authService: BgAuthService) {}

  async postWithAuth(url: string, body: any) {
    const auth = this.authService.auth;
    if (!auth || !auth.currentUser) throw new Error('Utilisateur non connecté');
    const user = auth.currentUser;
    const token = await user.getIdToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.post(url, body, { headers }).toPromise();
  }

  async initAdminBack() {
    const url = 'https://europe-west1-job4you-78ed0.cloudfunctions.net/initadmin';
    const auth = this.authService.auth;
    if (!auth || !auth.currentUser) throw new Error('Utilisateur non connecté');
    const user = auth.currentUser;
    const token = await user.getIdToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    // <--- Passe responseType ici, pas dans les headers !
    return this.http.get(url, { headers, responseType: 'text' }).toPromise();
  }
}
