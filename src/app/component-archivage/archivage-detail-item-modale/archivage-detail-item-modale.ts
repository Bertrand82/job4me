import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ArchiveItem } from '../archive-item/archive-item';
import { ArchiveLettre } from '../component-archivage';

@Component({
  selector: 'app-archivage-detail-item-modale',
  imports: [],
  templateUrl: './archivage-detail-item-modale.html',
  styleUrl: './archivage-detail-item-modale.css'
})
export class ArchivageDetailItemModale {



  constructor(
    public dialogRef: MatDialogRef<ArchivageDetailItemModale>,
    @Inject(MAT_DIALOG_DATA) public data: ArchiveLettre// Data passée à la modale
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }

  voirOffreEmploi() {
    window.open(this.data.offreEmploi.url, '_blank');
  }
}
