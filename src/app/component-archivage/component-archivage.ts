import { ChangeDetectorRef, Component } from '@angular/core';
import { CV } from '../component-cv/component-cv';
import { OffreEmploi } from '../component-offre-emploi/component-offre-emploi';
import { ArchiveItem } from './archive-item/archive-item';
import { CommonModule } from '@angular/common';
import { BgIndexedDBService } from '../services/bg-indexed-db';

@Component({
  selector: 'component-archivage',
  imports: [ArchiveItem, CommonModule],
  templateUrl: './component-archivage.html',
  styleUrl: './component-archivage.css',
})
export class ComponentArchivage {
  componentArchivage!: ComponentArchivage;
  listArchive: Array<ArchiveLettre> = [];

  constructor(private bgIndexedDBService: BgIndexedDBService,private changeDetectorRef: ChangeDetectorRef) {
    this.componentArchivage = this;


    /*promiselistArchive.then((listArchive) => {
      this.listArchive = listArchive;
    });*/
  }

  ngOnInit() {
    const promiselistArchive:Promise<ArchiveLettre[]>= this.bgIndexedDBService.getArchives();
    console.log("bg Récupération promiselistArchive : ",promiselistArchive);
    this.bgIndexedDBService.getArchives().then((archives: ArchiveLettre[]) => {
      this.listArchive = archives;
      console.log("bg Récupération listArchive : ",this.listArchive);
      this.changeDetectorRef.detectChanges();
    });
  }


  public archiveLetter(
    texteLettre: string,
    prompt: string,
    offreEmploi: OffreEmploi,
    cv: CV
  ) {
    console.log('Archiving letter...');

    const archiveLettre: ArchiveLettre = new ArchiveLettre(
      texteLettre,
      prompt,
      offreEmploi,
      cv
    );
    this.listArchive.push(archiveLettre);
    console.log('Archiving letter...' + this.listArchive.length);
    this.bgIndexedDBService.ajouterArchive(archiveLettre);
  }

  deleteArchiveLettre(id: string) {
    const index = this.listArchive.findIndex((archive) => archive.id === id);
    if (index !== -1) {
      this.listArchive.splice(index, 1);
      console.log('Archive deleted:', id);
      this.bgIndexedDBService.supprimerArchive(id);
    } else {
      console.log('Archive not found:', id);
    }
  }
}

export class ArchiveLettre {
  id: string;
  selected: boolean = false;
  constructor(
    public texteLettre: string,
    public prompt: string,
    public offreEmploi: OffreEmploi,
    public cv: CV
  ) {
    this.id = Math.random().toString(36).substr(2, 9);
  }
}
