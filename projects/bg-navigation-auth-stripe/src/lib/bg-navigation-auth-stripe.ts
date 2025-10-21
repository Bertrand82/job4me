import { Component } from '@angular/core';
import { BgAuthService } from './bg-auth-service';
import { MatDialog } from '@angular/material/dialog';
import { ComponentConnexionModale } from './component-connexion-modale/component-connexion-modale';
import { CommonModule } from '@angular/common';
import { ComponentSettingsModale } from './component-settings-modale/component-settings-modale';

@Component({
  selector: 'lib-bg-navigation-auth-stripe',
  imports: [CommonModule],
  templateUrl: `bg-navigation-auth-stripe.html`,
  styles: ``,
})
export class BgNavigationAuthStripe {
  constructor(public auth: BgAuthService, private dialog: MatDialog) {}

  onSettings() {
    console.log('Ouverture des paramètres utilisateur');
    this.dialog.open(ComponentSettingsModale, {
      data: 'bbb',
    });
  }

  onConnectionRequest() {
    console.log('Tentative de connexion  :');

    this.dialog.open(ComponentConnexionModale, {
      data: 'aaa',
    });
  }


}
