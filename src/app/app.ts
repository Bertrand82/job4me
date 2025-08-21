import { Component,ViewEncapsulation,ViewChild  } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// Update the import path to the correct relative path or install the package if missing
import { ComponentCV } from './component-cv/component-cv';
import { ComponentOffreEmploi } from "./component-offre-emploi/component-offre-emploi";
import { ComponentPersonalisation } from "./component-personalisation/component-personalisation";

@Component({
  selector: 'app-root',
  imports: [ ComponentCV, ComponentOffreEmploi, ComponentPersonalisation],
  templateUrl: './app.html',
  styleUrl: './app.css',
  encapsulation: ViewEncapsulation.None,
})
export class App {

  protected title = 'bgOffreEmploiRepondeur';

@ViewChild('cv') componentCV!: ComponentCV;
@ViewChild('offreEmploi') componentOffreEmploi!: ComponentOffreEmploi;
@ViewChild('personalisation') componentPersonalisation!: ComponentPersonalisation;

  generateLetter() {
    console.log('Génération de la lettre de motivation...cv',this.componentCV.cvContent);
    console.log('Génération de la lettre de motivation...oe',this.componentOffreEmploi.offreEmploiContent);
    console.log('Génération de la lettre de motivation...pe',this.componentPersonalisation.personnalite);
    console.log('Génération de la lettre de motivation...pe',this.componentPersonalisation.objectif);
    console.log('Génération de la lettre de motivation...pe',this.componentPersonalisation.competence);
}
}
