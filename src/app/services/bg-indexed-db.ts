import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';



@Injectable({
  providedIn: 'root'
})



@Injectable({ providedIn: 'root' })
export class BgIndexedDBService {
  constructor(private dbService: NgxIndexedDBService) {}

  ajouterOffre(offre: any) {
    return this.dbService.add('offres', offre);
  }

  getOffres() {
    return this.dbService.getAll('offres');
  }
}
