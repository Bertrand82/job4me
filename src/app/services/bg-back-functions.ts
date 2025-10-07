import { Injectable } from '@angular/core';
/**
 * Service providing backend function URLs and versioning.
 * Pour lancer l'emulateur local: >bg build && firebase emulators:start --only functions
 * Pour déployer les fonctions: > bg build && firebase deploy --only functions
 *
 */
@Injectable({
  providedIn: 'root'
})
export class BgBackFunctions {

  getUrlHost():string {
    if ((window.location.hostname === '127.0.0.1') || (window.location.hostname === 'localhost')) {
      return 'http://127.0.0.1:5001/job4you-78ed0/europe-west1';
    }
    return 'https://europe-west1-job4you-78ed0.cloudfunctions.net';
  }


  getVerion():string {
    return '2';
  }

}
