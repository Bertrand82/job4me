import { Injectable } from '@angular/core';
import { NgxIndexedDBService, WithID } from 'ngx-indexed-db';
import { ArchiveLettre } from '../component-archivage/component-archivage';
import { firstValueFrom, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})



@Injectable({ providedIn: 'root' })
export class BgIndexedDBService {
  constructor(private dbService: NgxIndexedDBService) {}

  ajouterOffre(offre: ArchiveLettre) {
    console.log("bg AAAA IndexedDB - ajout de l'offre : ",offre);
    const obs: Observable<ArchiveLettre & WithID> = this.dbService.add('offreEmploi', offre);
     console.log("bg BBBB  IndexedDB - ajout de l'offre : done ",obs);
     obs.subscribe({
       next: (result) => {
         console.log("bg CCCC  IndexedDB - ajout de l'offre : success ", result);
         this.testOffres();
       },
       error: (error) => {
         console.error("bg DDDD  IndexedDB - ajout de l'offre : error ", error);
       }
     });
  }

  supprimerOffre(id:string){
    const obs: Observable<unknown[]> = this.dbService.delete('offreEmploi', id);
    obs.subscribe({
      next: () => {
        console.log("bg XXXX  IndexedDB - suppression de l'offre : success ", id);
        this.testOffres();
      },
      error: (error) => {
        console.error("bg YYYY  IndexedDB - suppression de l'offre : error ", error);
      }
    });
  }


 getOffres(): Promise<ArchiveLettre[]> {
     const promise:Promise<ArchiveLettre[]> = firstValueFrom(this.dbService.getAll('offreEmploi'));
     return promise;
  }

  testOffres() {
    this.getOffres().then((offres) => {
      console.log("bg EEEE  IndexedDB - récupération des offres : success ", offres);
    }).catch((error) => {
      console.error("bg FFFF  IndexedDB - récupération des offres : error ", error);
    });
  }
}
