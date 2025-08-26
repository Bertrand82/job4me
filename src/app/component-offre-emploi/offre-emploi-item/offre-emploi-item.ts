import { Component, Input } from '@angular/core';
import { ComponentOffreEmploi, OffreEmploi } from '../component-offre-emploi';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-offre-emploi-item',
  imports: [FormsModule],
  templateUrl: './offre-emploi-item.html',
  styleUrl: './offre-emploi-item.css',
})
export class OffreEmploiItem {

  @Input() componentOffreEmploi!: ComponentOffreEmploi;
  @Input() offreEmploi!: OffreEmploi;


deleteOffreEmploi() {
    console.log('deleteOE id ', this.offreEmploi.id);
    this.componentOffreEmploi.deleteOffreEmploi(this.offreEmploi.id);
}
voirOffreEmploi() {
   const url = this.offreEmploi.url;
   window.open(url, '_blank');
}
telechargerOffreEmploi() {
throw new Error('Method not implemented.');
}
selectionnerOffreEmploi() {
  this.componentOffreEmploi.listOffreEmploi.forEach(oe => oe.selected = false);
  this.offreEmploi.selected = true;
}
}
