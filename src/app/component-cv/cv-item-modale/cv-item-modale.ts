import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CV } from '../component-cv';


@Component({
  selector: 'app-archivage-detail-item-modale',
  imports: [],
  templateUrl: './cv-item-modale.html',
  styleUrl: './cv-item-modale.css'
})
export class CVItemModale {



  constructor(
    public dialogRef: MatDialogRef<CVItemModale>,
    @Inject(MAT_DIALOG_DATA) public cv: CV// Data passée à la modale
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }

  voirOffreEmploi() {

  }
}
