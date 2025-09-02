import { Injectable } from '@angular/core';
import { NgxIndexedDBService, WithID } from 'ngx-indexed-db';
import { ArchiveLettre } from '../component-archivage/component-archivage';
import { firstValueFrom, Observable } from 'rxjs';
import { CV } from '../component-cv/component-cv';


@Injectable({
  providedIn: 'root'
})



@Injectable({ providedIn: 'root' })
export class BgIndexedDBService {

  constructor(private dbService: NgxIndexedDBService) {}

  ajouterArchive(offre: ArchiveLettre) {
    console.log("bg AAAA IndexedDB - ajout de l'offre : ",offre);
    const obs: Observable<ArchiveLettre & WithID> = this.dbService.add('offreEmploi', offre);
     console.log("bg BBBB  IndexedDB - ajout de l'offre : done ",obs);
     obs.subscribe({
       next: (result) => {
         console.log("bg CCCC  IndexedDB - ajout de l'offre : success ", result);
         //this.testArchives();
       },
       error: (error) => {
         console.error("bg DDDD  IndexedDB - ajout de l'offre : error ", error);
       }
     });
  }

  supprimerArchive(id:string){
    const obs: Observable<unknown[]> = this.dbService.delete('offreEmploi', id);
    obs.subscribe({
      next: () => {
        console.log("bg XXXX  IndexedDB - suppression de l'offre : success ", id);
        //this.testArchives();
      },
      error: (error) => {
        console.error("bg YYYY  IndexedDB - suppression de l'offre : error ", error);
      }
    });
  }


 getArchives(): Promise<ArchiveLettre[]> {
     const promise:Promise<ArchiveLettre[]> = firstValueFrom(this.dbService.getAll('offreEmploi'));
     return promise;
  }

  testArchives() {
    this.getArchives().then((offres) => {
      console.log("bg EEEE  IndexedDB - récupération des offres : success ", offres);
    }).catch((error) => {
      console.error("bg FFFF  IndexedDB - récupération des offres : error ", error);
    });
  }

   testCVs() {
    this.getCVs ().then((listCv) => {
      console.log("bg EEEE  IndexedDB - récupération des cv  : success ", listCv);
    }).catch((error) => {
      console.error("bg FFFF  IndexedDB - récupération des cv : error ", error);
    });
  }

  ajouterCV(cvItem: CV) {
    console.log("bg AAAA IndexedDB - ajout du CV : ",cvItem);
     const obs: Observable<CV & WithID> = this.dbService.add('CV', cvItem);
     console.log("bg BBBB  IndexedDB - ajout de cvItem : done ",obs);
     obs.subscribe({
       next: (result) => {
         console.log("bg CCCC  IndexedDB - ajout de cvItem : success ", result);
         this.testCVs();
       },
       error: (error) => {
         console.error("bg DDDD  IndexedDB - ajout de cvItem : error ", error);
       }
     });
  }

   getCVs(): Promise<CV[]> {
     const promise:Promise<CV[]> = firstValueFrom(this.dbService.getAll('CV'));
     return promise;
  }
}
