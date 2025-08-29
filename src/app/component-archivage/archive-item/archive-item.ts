import { ArchivageDetailItemModale } from './../archivage-detail-item-modale/archivage-detail-item-modale';
import { ArchiveLettre, ComponentArchivage } from './../component-archivage';
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-archive-item',
  imports: [CommonModule, FormsModule, CommonModule],
  templateUrl: './archive-item.html',
  styleUrl: './archive-item.css',
})
export class ArchiveItem {
  @Input() archiveLettre!: ArchiveLettre;
  @Input() componentArchivage!: ComponentArchivage;

  constructor(private dialog: MatDialog) {}

  displayModale() {
    this.dialog.open(ArchivageDetailItemModale, {
      data: this.archiveLettre,
    });
  }
  deleteArchiveLettre() {
    console.log("Suppression de l'archive ", this.archiveLettre);
    this.componentArchivage.deleteArchiveLettre(this.archiveLettre.id);
  }
  voirOffreEmploi() {
    console.log("Voir l'offre d'emploi ", this.archiveLettre);
    window.open(this.archiveLettre.offreEmploi.url, '_blank');
  }
}
