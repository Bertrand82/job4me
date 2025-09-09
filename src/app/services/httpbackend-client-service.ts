import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BgAuthService } from   './bg-auth-service';

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
      'Content-Type': 'text/plain',
      responseType: 'text'
//      'Content-Type': 'application/json',
//      responseType: 'text',
    });

    return this.http.post(url, body, { headers }).toPromise();
  }
}
