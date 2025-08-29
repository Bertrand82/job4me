import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OffreEmploi } from '../component-offre-emploi';

@Component({
  selector: 'app-offre-emploi-detail-modale',
  templateUrl: './offre-emploi-detail-modale.html',
  styleUrls: ['./offre-emploi-detail-modale.css'],
})
export class OffreEmploiDetailModale {
  constructor(
    public dialogRef: MatDialogRef<OffreEmploiDetailModale>,
    @Inject(MAT_DIALOG_DATA) public data: OffreEmploi // Data passée à la modale
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }

  voirOffreEmploi() {
    window.open(this.data.url, '_blank');
  }
}
