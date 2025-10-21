import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BgAuthService } from '../../public-api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { BgBackFunctions } from '../bg-back-functions';

@Component({
  selector: 'app-component-connexion-modale',
  imports: [CommonModule, FormsModule],
  templateUrl: './component-settings-modale.html',
  styleUrls: ['./component-settings-modale.css'],
})
export class ComponentSettingsModale {
  email = '';
  isAbonnementOK = true;

  constructor(
    public dialogRef: MatDialogRef<ComponentSettingsModale>,
    public auth: BgAuthService,
    private http: HttpClient,
    private changeDetectorRef: ChangeDetectorRef,
    private bgBackFunctions: BgBackFunctions

  ) {}

  ngOnInit(): void {
    this.email = this.auth.currentUser()?.email || '';
  }
  onLogout() {
    console.log('B Tentative de logout avec auth :', this.auth);
    this.auth.logout();
    this.onClose();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onClose(): void {
    this.dialogRef.close();
  }

  abonnement() {
    console.log('abonnement request');
  }

  desabonnement() {
    console.log('desabonnement request');
  }
}
