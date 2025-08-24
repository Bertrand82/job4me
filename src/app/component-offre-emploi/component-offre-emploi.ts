import { Component } from '@angular/core';
import { BgGemini , reponseAnalyseOffreEmploi } from '../services/bg-gemini';

@Component({
  selector: 'offre-emploi',
  imports: [],
  templateUrl: './component-offre-emploi.html',
  styleUrl: './component-offre-emploi.css',
})
export class ComponentOffreEmploi {
  offreEmploiContent = '';
  isProcessing: boolean = false;
  httpStatus: any;
  constructor (private gemini: BgGemini) {}
  onTextareaChange($event: Event) {
    this.offreEmploiContent = ($event.target as HTMLTextAreaElement).value;
    console.log('Contenu de l’offre d’emploi 2:', this.offreEmploiContent);
    this.analyseOffreEmploi();
  }

  analyseOffreEmploi() {

    const data:any = {

      offreEmploi: this.offreEmploiContent,

    }
    console.log( 'Analyse Offre Emploi',data    );
    const prompt :string=this.makePrompt(data);
    this.askGemini(prompt);
  }

  makePrompt(data: any) {
   return " Analyse l'offre d'emploi suivante et extrait les informations suivantes : La langue de l'offre, Un résumé de l'offre en français (4-5 lignes), Le nom de la société, Le nom de la personne, Le lieu du poste. Précise si le poste est en freelance ou non , Indique s'il s'agit d'un emploi salarié ou d'uneprestation de service .Voici l'offre à analyser :: "+JSON.stringify(this.offreEmploiContent);
   // return `Génére une lettre de motivation pour repondre à l'offre d'emploi avec les données suivante : ${JSON.stringify(data)}`;
  }

     askGemini(prompt:string): void {
        this.isProcessing = true;
        this.gemini.generateContent(prompt,reponseAnalyseOffreEmploi).subscribe({
        next: (res) => {
          this.isProcessing = false;

          this.httpStatus = res.status;
          console.log('status', this.httpStatus);
          console.log('responseRequest', res);
          console.log('candidates', res.candidates);
          const candidat = res.candidates[0];

          console.log('candidat', candidat);
          const content = candidat.content;
          console.log('content ', content);
          const parts = content.parts;
          const part0 = parts[0];
          console.log('part0', part0);
          const text = part0.text;
          console.log('text: ', text);
          const obj = JSON.parse(text);
          console.log('isOk:', obj);



          this.alertOnResult();
        },
        error: (err) => {
          this.isProcessing = false;

          console.log('responseRequest', err);
          this.httpStatus = err.status;
          console.log('status', this.httpStatus);

        },
      });
    }
    alertOnResult() {
      var alertStr = ' result from gemini!!!';
      alert(alertStr);
    }


}
