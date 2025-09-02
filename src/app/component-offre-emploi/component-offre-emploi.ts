import { ChangeDetectorRef, Component } from '@angular/core';
import { BgGemini, reponseAnalyseOffreEmploi } from '../services/bg-gemini';
import { OffreEmploiItem } from './offre-emploi-item/offre-emploi-item';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProxyApiService } from '../services/proxy-api-service';

@Component({
  selector: 'offre-emploi',
  imports: [OffreEmploiItem, CommonModule, FormsModule],
  templateUrl: './component-offre-emploi.html',
  styleUrl: './component-offre-emploi.css',
})
export class ComponentOffreEmploi {
  offreEmploiContent = '';
  offreEmploi: OffreEmploi | null = null;
  listOffreEmploi: OffreEmploi[] = [];
  isProcessing: boolean = false;
  httpStatus: any;
  componentOffreEmploi!: ComponentOffreEmploi;
  urlOffreEmploi: string = '';

  constructor(
    private gemini: BgGemini,
    private changeDetectorRef: ChangeDetectorRef,
    private proxyApiService: ProxyApiService
  ) {
    this.componentOffreEmploi = this;
    this.listOffreEmploi = this.getOffreEmploiFromLocalStorage();
  }

  onTextareaChange($event: Event) {
    //this.offreEmploiContent = ($event.target as HTMLTextAreaElement).value;
  }

  onTextFieldUrlChange($event: Event) {
    const urlOffreEmploi2 = ($event.target as HTMLInputElement).value;
    console.log('urlOffreEmploi', urlOffreEmploi2);
    this.urlOffreEmploi = urlOffreEmploi2;
    //this.processUrlOffreEmploi();
  }

  processOffreEmploiUrl() {
    if (this.urlOffreEmploi == '') {
      alert("Veuillez coller une offre d'emploi.");
      return;
    }
    const prompt: string = this.makePromptAnalyseOffreEmploiFromURL(this.urlOffreEmploi);
    this.askGeminiAnalyseOffreEmploiUrl(prompt);
  }




  onSaveOffreEmploi() {
    console.log('Contenu de l offre d emploi 2:', this.offreEmploiContent);
    this.analyseOffreEmploiFromText();
  }

  analyseOffreEmploiFromText() {
    if (this.offreEmploiContent == '') {
      alert("Veuillez coller une offre d'emploi.");
      return;
    }
    const data: any = {
      offreEmploi: this.offreEmploiContent,
    };
    console.log('Analyse Offre Emploi', data);
    const prompt: string = this.makePromptAnalyseOffreEmploiFromContent(data);
    this.askGeminiAnalyseOffreEmploiContent(prompt);
  }

  makePromptAnalyseOffreEmploiFromContent(data: any) {
    return (
      " Analyse l'offre d'emploi suivante et extrait les informations suivantes : La langue de l'offre, Un résumé de l'offre en français (4-5 lignes), Le nom de la société, Le nom de la personne, Le lieu du poste. Précise si le poste est en freelance ou non , Indique s'il s'agit d'un emploi salarié ou d'uneprestation de service .Voici l'offre à analyser :: " +
      JSON.stringify(this.offreEmploiContent)
    );
    // return `Génére une lettre de motivation pour repondre à l'offre d'emploi avec les données suivante : ${JSON.stringify(data)}`;
  }

  makePromptAnalyseOffreEmploiFromURL(dataUrl: string) {
    return (
      " Analyse l'offre d'emploi suivante et extrait les informations suivantes : La langue de l'offre, Un résumé de l'offre en français (4-5 lignes), Le nom de la société, Le nom de la personne, Le lieu du poste. Précise si le poste est en freelance ou non , Indique s'il s'agit d'un emploi salarié ou d'uneprestation de service .Voici l'offre à analyser :: " +
      "url :" + dataUrl
    );
    // return `Génére une lettre de motivation pour repondre à l'offre d'emploi avec les données suivante : ${JSON.stringify(data)}`;
  }

  askGeminiAnalyseOffreEmploiContent(prompt: string): void {
    this.isProcessing = true;
    this.gemini.generateContent(prompt, reponseAnalyseOffreEmploi).subscribe({
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
        const textRetour = part0.text;
        console.log('text: ', textRetour);
        const obj = JSON.parse(textRetour);
        console.log('isOk:', obj);

        this.offreEmploi = new OffreEmploi(obj, this.offreEmploiContent,this.urlOffreEmploi);
        this.listOffreEmploi.push(this.offreEmploi);
        this.storeCV();
        this.offreEmploiContent = '';
        this.changeDetectorRef.detectChanges();
        //this.alertOnResult();
      },
      error: (err) => {
        this.isProcessing = false;

        console.log('responseRequest', err);
        this.httpStatus = err.status;
        console.log('status', this.httpStatus);
        console.log('errA', err);
        console.log('err.message', err.message);
        console.log('err.error', err.error);
        console.log('err.error.error', err.error.error);
        console.log('err.error.error.message', err.error.error.message);
      },
    });
  }

  askGeminiAnalyseOffreEmploiUrl(prompt: string): void {
    this.isProcessing = true;
    this.gemini.generateContent(prompt, reponseAnalyseOffreEmploi).subscribe({
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
        const textRetour = part0.text;
        console.log('text: ', textRetour);
        const obj = JSON.parse(textRetour);
        console.log('isOk:', obj);

        this.offreEmploi = new OffreEmploi(obj, this.offreEmploiContent,this.urlOffreEmploi);
        this.listOffreEmploi.push(this.offreEmploi);
        this.offreEmploiContent=this.offreEmploi.resume;
        this.storeCV();
        //this.offreEmploiContent =this.offreEmploi.resume;
        this.offreEmploi.contentInitial = this.offreEmploi.resume;
        this.changeDetectorRef.detectChanges();
        this.urlOffreEmploi = '';
        //this.alertOnResult();
      },
      error: (err) => {
        this.isProcessing = false;

        console.log('responseRequest', err);
        this.httpStatus = err.status;
        console.log('status', this.httpStatus);
        console.log('errA', err);
        console.log('err.message', err.message);
        console.log('err.error', err.error);
        console.log('err.error.error', err.error.error);
        console.log('err.error.error.message', err.error.error.message);
      },
    });
  }

  alertOnResult() {
    var alertStr =
      ' result from gemini!!! \n' + JSON.stringify(this.offreEmploi, null, 4);
    console.log('offre Emploi', this.offreEmploi);
    alert(alertStr);
  }

  deleteOffreEmploi(idOffreEmploi: number) {
    console.log('deleteOE id ', idOffreEmploi);
    console.log('deleteOE  offre', this.listOffreEmploi);
    const index = this.listOffreEmploi.findIndex(
      (item) => item.id == idOffreEmploi
    );
    if (index !== -1) {
      this.listOffreEmploi.splice(index, 1);
      this.storeCV();
    }
    console.log('deleteOE  offre après suppression', this.listOffreEmploi);
  }
  storeCV() {
    console.log('storeOE ', this.listOffreEmploi);
    localStorage.setItem(
      'listOffreEmploi',
      JSON.stringify(this.listOffreEmploi)
    );
  }
  getOffreEmploiFromLocalStorage(): OffreEmploi[] {
    const storedOffreEmploi = localStorage.getItem('listOffreEmploi');
    if (storedOffreEmploi) {
      try {
        return JSON.parse(storedOffreEmploi);
      } catch (error) {
        console.error(
          'Erreur lors de la récupération des offres d’emploi depuis le localStorage:',
          error
        );
        return [];
      }
    }
    return [];
  }

  getOffreEmploiSelected(): OffreEmploi {
    if (this.listOffreEmploi.length == 0) {
      alert("Veuillez coller une offre d'emploi.");
      throw new Error("Aucune offre d'emploi sélectionnée.");
    }
    if (this.listOffreEmploi.length == 1) {
      this.listOffreEmploi[0].selected = true;
      return this.listOffreEmploi[0];
    }
    const offreEmploi = this.listOffreEmploi.find((item) => item.selected);
    if (!offreEmploi) {
      alert("Veuillez sélectionner une offre d'emploi.");
      throw new Error("Aucune offre d'emploi sélectionnée.");
    }
    return offreEmploi;
  }
}

export class OffreEmploi {
  titre: string;
  date: string;
  langue: string;
  societe: string;
  personne: string;
  lieu: string;
  freelance: boolean;
  resume: string;
  contentInitial: string;
  selected: boolean = false;
  url:string ;
  id: number; // Génère un id entre 0 et 999999
  constructor(data: any, content: string,url: string) {
    this.titre = data['offre.titre'] || 'Titre non spécifié';
    this.date = data['offre.date'];
    this.langue = data['offre.langue'];
    this.resume = data['offre.resume'];
    this.societe = data['offre.societe'];
    this.personne = data['offre.personne'];
    this.lieu = data['offre.lieu'];
    this.freelance = data['offre.freelance'];
    this.contentInitial = content;
    this.url = url;
    this.id = Math.floor(Math.random() * 1000000);
  }
  public toString2() {
    return `Titre: ${this.titre}
Langue: ${this.langue}
Société: ${this.societe}
Personne: ${this.personne}
Lieu: ${this.lieu}
Freelance: ${this.freelance}
Offre Emploi: ${this.contentInitial}`;
  }
}
