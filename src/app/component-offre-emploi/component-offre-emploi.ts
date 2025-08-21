import { Component } from '@angular/core';

@Component({
  selector: 'offre-emploi',
  imports: [],
  templateUrl: './component-offre-emploi.html',
  styleUrl: './component-offre-emploi.css',
})
export class ComponentOffreEmploi {
  offreEmploiContent = '';
  onTextareaChange($event: Event) {
    this.offreEmploiContent = ($event.target as HTMLTextAreaElement).value;
    console.log('Contenu de l’offre d’emploi :');
  }

}
