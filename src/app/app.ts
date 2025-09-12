import {
  Component,
  ViewEncapsulation,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { RouterModule } from '@angular/router';
// Update the import path to the correct relative path or install the package if missing
import { ComponentCV } from './component-cv/component-cv';
import {
  ComponentOffreEmploi,
  OffreEmploi,
} from './component-offre-emploi/component-offre-emploi';
import { ComponentPersonalisation } from './component-personalisation/component-personalisation';
import { BgGemini, responseShemaGemini_v11 } from './services/bg-gemini';
import { ComponentArchivage } from './component-archivage/component-archivage';
import { LoginComponent } from "./component-bg-auth/component-bg-auth";
import { KeysService } from './services/bg-environment-keys-service';
import { ComponentDebug } from './component-debug/component-debug';
import { ComponentStripe } from "./component-stripe/component-stripe";
@Component({
  selector: 'app-root',
  imports: [
    ComponentCV,
    ComponentOffreEmploi,
    ComponentPersonalisation,
    ComponentDebug,
    FormsModule,
    CommonModule,
    ComponentArchivage,
    LoginComponent,
    ComponentStripe
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
  @ViewChild('componentArchivage') componentArchivage!: ComponentArchivage;
  isProcessing: boolean = false;
  httpStatus: any;
  texteLettre!: string;
  prompt!: string;
  nombreDeMots = 0;
  constructor(
    private gemini: BgGemini,
    private changeDetectorRef: ChangeDetectorRef,
    private keysService: KeysService
  ) {}

   ngOnInit() {
    this.keysService.loadKeys();

  }
  generateLetter() {
    const data: any = {
      cv: this.componentCV.getCvSelected().content,
      offreEmploi: this.componentOffreEmploi.offreEmploiContent,
      personnalite: this.componentPersonalisation.personnalite,
      pointA: this.componentPersonalisation.pointA,
      pointB  : this.componentPersonalisation.pointB,
    };
    console.log('Génération', data);
    this.prompt = this.makePrompt(data);
    const prompt2 = this.prompt;
    const schema = responseShemaGemini_v11(data.offreEmploi.langue);
    this.askGemini(prompt2,schema);
  }
  makePrompt(data: any) {
    const offreEmploiSelected: OffreEmploi =
    this.componentOffreEmploi.getOffreEmploiSelected();
    console.log('offreEmploiSelected', offreEmploiSelected);
    const langue = offreEmploiSelected.langue?offreEmploiSelected.langue:"fr";
    const p =
      "génère une lettre de motivation pour une offre d'emploi   avec les informations suivantes : " +
      '\n Personnalité : ' +
      this.componentPersonalisation.personnalite +
      '\n Nombre de mots maximum : ' +
      this.componentPersonalisation.nombreDeMotsMax +
      '\n particuarités : ' +
      this.componentPersonalisation.pointA +
      '\n particularités : ' +
      this.componentPersonalisation.pointB +
      '\n Offre emploi : ' +
      JSON.stringify(offreEmploiSelected) +
      ' CV : ' +
      JSON.stringify(this.componentCV.getCvSelected());
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

  askGemini(prompt: string, schema: any): void {
    this.isProcessing = true;
    this.gemini.generateContent(prompt, schema).subscribe({
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
    alert('prompt :' + this.prompt);
    navigator.clipboard.writeText(this.prompt);
  }

  archiveLetter() {
    console.log('Archive letter ',this.componentArchivage===null);
    this.componentArchivage.archiveLetter(this.texteLettre, this.prompt,this.componentOffreEmploi.getOffreEmploiSelected(),this.componentCV.getCvSelected() );
  }
}
