import { Component } from '@angular/core';
import { CV } from '../component-cv/component-cv';
import { OffreEmploi } from '../component-offre-emploi/component-offre-emploi';
import { ArchiveItem } from "./archive-item/archive-item";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'component-archivage',
  imports: [ArchiveItem,CommonModule],
  templateUrl: './component-archivage.html',
  styleUrl: './component-archivage.css'
})
export class ComponentArchivage {
  componentArchivage!: ComponentArchivage;
  listArchive: Array<ArchiveLettre> = [];

  constructor() {
    this.componentArchivage = this;
  }
  public archiveLetter(texteLettre: string, prompt: string, offreEmploi: OffreEmploi, cv: CV) {
    console.log('Archiving letter...');

    const archiveLettre: ArchiveLettre = new ArchiveLettre(texteLettre, prompt, offreEmploi, cv);
    this.listArchive.push(archiveLettre);
    console.log('Archiving letter...'+this.listArchive.length);
  }

}

export class ArchiveLettre {
  id:string
  selected: boolean = false;
  constructor(
    public texteLettre: string,
    public prompt: string,
    public offreEmploi: OffreEmploi,
    public cv: CV,

  ) {
    this.id = Math.random().toString(36).substr(2, 9);
  }
}
