import { Component, Input } from '@angular/core';
import { ComponentOffreEmploi, OffreEmploi } from '../component-offre-emploi';
import { FormsModule } from '@angular/forms';
import { OffreEmploiDetailModale } from '../offre-emploi-detail-modale/offre-emploi-detail-modale';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-offre-emploi-item',
  imports: [FormsModule],
  templateUrl: './offre-emploi-item.html',
  styleUrl: './offre-emploi-item.css',
})
export class OffreEmploiItem {
  @Input() componentOffreEmploi!: ComponentOffreEmploi;
  @Input() offreEmploi!: OffreEmploi;

  constructor(private dialog: MatDialog) {}
  deleteOffreEmploi() {
    console.log('deleteOE id ', this.offreEmploi.id);
    this.componentOffreEmploi.deleteOffreEmploi(this.offreEmploi.id);
  }
  voirOffreEmploi() {
    const url = this.offreEmploi.url;
    window.open(url, '_blank');
  }
  telechargerOffreEmploi() {
    console.log('telechargerOE id ', this.offreEmploi.id);
    this.openOffreDetail();
  }

  openOffreDetail() {
    this.dialog.open(OffreEmploiDetailModale, {
      data: this.offreEmploi,
    });
  }

  selectionnerOffreEmploi() {
    this.componentOffreEmploi.listOffreEmploi.forEach(
      (oe) => (oe.selected = false)
    );
    this.offreEmploi.selected = true;
  }
}
