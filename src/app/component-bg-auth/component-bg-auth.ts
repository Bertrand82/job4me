import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BgAuthService } from '../services/bg-auth-service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  template: `
    <form>
      <input [(ngModel)]="email" name="email" placeholder="Email" />
      <input
        [(ngModel)]="password"
        name="password"
        type="password"
        placeholder="Password"
      />
      <button (click)="onLogin()" type="submit">Se connecter</button>
      <button (click)="onPasswordReset()" type="button">
        Mot de passe oublié
      </button>
      <button (click)="onRegister()" type="submit">Register</button>
    </form>

    <div *ngIf="auth.currentUser() as user">
      Connecté en tant que {{ user?.email }}
      <button (click)="onLogout()">Déconnexion</button>
    </div>
  `,
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(public auth: BgAuthService) {}

  onLogin() {
    console.log('A Tentative de connexion avec email :', this.email);
    console.log('B Tentative de connexion avec auth :', this.auth);

    this.auth.login(this.email, this.password).catch((err) => {
      console.log('C Erreur Auth err:', err);
      window.alert(err.message);
    });
  }

  onLogout() {
    this.auth.logout();
  }

  onRegister() {
    this.auth.register(this.email, this.password).catch((err) => {
      console.log('C Erreur Auth err:', err);
      window.alert(err.message);
    });
  }

  onPasswordReset() {
    console.log('A Tentative de reset password avec email :', this.email);
    const obj:Promise<any> = this.auth.sendPasswordResetEmail2(this.email).catch((err) => {
      console.log('C Erreur Auth err:', err);
      window.alert(err.message);
    });
    console.log('B Objet de reset password:', obj);
    obj.then((res) => {
      console.log('D Réponse de reset password: res', res);
      console.log('E mail de reset password: ', this.email);
    });
  }
}
