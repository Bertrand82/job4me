import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BgAuthService } from '../services/bg-auth-service';
import { MatDialog } from '@angular/material/dialog';
import { ComponentConnexionModale } from './component-connexion-modale/component-connexion-modale';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './component-bg-auth.html',
  styleUrls: ['./component-bg-auth.css'],
})
export class LoginComponent {

  email = '';
  password = '';

  constructor(public auth: BgAuthService,private dialog: MatDialog) {}



  onConnectionRequest() {
    console.log('Tentative de connexion  :');

        this.dialog.open(ComponentConnexionModale, {
          data: "aaa",
        });

  }

   onLogout() {
    this.auth.logout();
  }
}
