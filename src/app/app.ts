import {
  Component,
  ViewEncapsulation,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
// Update the import path to the correct relative path or install the package if missing
import { ComponentCV } from './component-cv/component-cv';
import { ComponentOffreEmploi } from './component-offre-emploi/component-offre-emploi';
import { ComponentPersonalisation } from './component-personalisation/component-personalisation';
import { BgGemini, responseShemaGemini_v1 } from './services/bg-gemini';
@Component({
  selector: 'app-root',
  imports: [
    ComponentCV,
    ComponentOffreEmploi,
    ComponentPersonalisation,
    FormsModule,
    CommonModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
  encapsulation: ViewEncapsulation.None,
})
export class App {
  protected title = 'bgOffreEmploiRepondeur';

  @ViewChild('cv') componentCV!: ComponentCV;
  @ViewChild('offreEmploi') componentOffreEmploi!: ComponentOffreEmploi;
  @ViewChild('personalisation')
  componentPersonalisation!: ComponentPersonalisation;
  isProcessing: boolean = false;
  httpStatus: any;
  texteLettre!: string;
  prompt!: string;
  nombreDeMots = 0;
  constructor(
    private gemini: BgGemini,
    private changeDetectorRef: ChangeDetectorRef
  ) {}
  generateLetter() {
    const data: any = {
      cv: this.componentCV.getCvSelected().content,
      offreEmploi: this.componentOffreEmploi.offreEmploiContent,
      personnalite: this.componentPersonalisation.personnalite,
      objectif: this.componentPersonalisation.objectif,
      competence: this.componentPersonalisation.competence,
    };
    console.log('Génération', data);
    this.prompt = this.makePrompt(data);
    const prompt2 = this.prompt;
    this.askGemini(prompt2);
  }
  makePrompt(data: any) {

     const p = "génère une lettre de motivation pour une offre d'emploi en francais avec les informations suivantes : " +
      "\n Personnalité : " + this.componentPersonalisation.personnalite +
      "\n Nombre de mots maximum : " + this.componentPersonalisation.nombreDeMotsMax +
      "\n Objectif : " + this.componentPersonalisation.objectif +
      "\n Compétence : " + this.componentPersonalisation.competence +
      "\n Offre emploi : " +this.componentOffreEmploi.getOffreEmploiSelected().toString2() +
      " CV : " +   JSON.stringify(this.componentCV.getCvSelected())
    ;
    return p;
    // return `Génére une lettre de motivation pour repondre à l'offre d'emploi avec les données suivante : ${JSON.stringify(data)}`;
  }
  makePromptMock_v1(): any {
    const dataMock: any = {
      cv: this.componentCV.getCvSelected(),
      offreEmploi: 'Job developpeur backend',
      personnalite: 'serieux',
      objectif: 'decouvrir technologie, methodes, secteur',
      competence: 'java , angular',
    };
    return dataMock;
  }

  askGemini(prompt: string): void {
    this.isProcessing = true;
    this.gemini.generateContent(prompt, responseShemaGemini_v1).subscribe({
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
        console.log('obj :', obj);
        this.texteLettre = obj.lettreMotivation;
        this.nombreDeMots = obj.nombreDeMots;
        this.changeDetectorRef.detectChanges();
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
  copyLetter() {
    navigator.clipboard.writeText(this.texteLettre);
  }
  displayPrompt() {
    alert("prompt :"+this.prompt);
    navigator.clipboard.writeText(this.prompt);
  }
}
