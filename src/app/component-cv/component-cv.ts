import { Component } from '@angular/core';
import { ComponentCVItem } from './cv-item/cv-item';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { BgIndexedDBService } from '../services/bg-indexed-db';
import {
  GeminiMultiModaleService,
  readFileAsBase64,
  reponseAnalyseCVMultimodal,
} from '../services/bg-gemini-multimodal';
import { BgBackFunctions } from '../services/bg-back-functions';
@Component({
  selector: 'app-component-cv',
  imports: [ComponentCVItem, CommonModule, FormsModule],
  templateUrl: './component-cv.html',
  styleUrl: './component-cv.css',
})
export class ComponentCV {
  [x: string]: any;
  cvContent: string = '';
  componentCV!: ComponentCV;
  cvItemSelected!: CV;
  cvItems: CV[] = [];
  showCvInputTextarea: boolean = false;
  isProcessing: boolean = false;
  constructor(
    private bgIndexedDBService: BgIndexedDBService,
    private changeDetectorRef: ChangeDetectorRef,
    private geminiMultiModale: GeminiMultiModaleService,
    private bgBackFunctions: BgBackFunctions
  ) {
    this.componentCV = this;
  }

  ngOnInit() {
    this.getCvItemsFromIndexedDB();
  }

  onFileSelected(event: Event) {
    this.isProcessing = true;
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.processCVByGeminiMultiModale(file);
    }
  }

  onSaveTextArea() {
    console.log('Save cv :', this.cvContent);
    const cvItem2 = new CV();
    console.log('Save cv :AAAAAAAAAAAAA', this.cvContent);
    cvItem2.content = this.cvContent; // Met à jour cvContent avec le contenu du textarea
    cvItem2.title =
      'CV texte libre ' + (this.cvContent + '         ').substring(0, 10);
    cvItem2.date = new Date().toLocaleDateString();
    this.cvItems.push(cvItem2);
    console.log('Save cv :BBBBBBBBBBBBB', this.cvItems);
    this.storeCVs();
    this.bgIndexedDBService.ajouterCV(cvItem2);
  }

  setCvSelected(cvItem: CV) {
    console.log('setCvSelected id ', cvItem.id);
    this.cvItemSelected = cvItem;
    this.cvItems.forEach((item) => {
      item.selected = item.id === this.cvItemSelected.id;
    });
  }

  processCVByGeminiMultiModale(file: File) {
    console.log('Processing CV by GeminiMultiModale:', file);
    console.log('Processing CV by GeminiMultiModale:', file.name);
    const prompt =
      'Analyse le Fichier joint et fournis la réponse strictement au format JSON selon le schéma fourni dans la requête. Ne donne ni commentaire ni texte hors du JSON. :';
    readFileAsBase64(file).then((base64) => {
      this.geminiMultiModale
        .analyseFileImageBase64(
          prompt,
          base64,
          file.type,
          reponseAnalyseCVMultimodal
        )
        .subscribe(
          (res) => {
            this.isProcessing = false;
            this.changeDetectorRef.detectChanges();
            console.log('GeminiMultiModale response:', res);
            const geminiData = res.geminiData;
            console.log("res.geminiData :: ", geminiData);
            const candidat = geminiData.candidates[0];

            console.log('GeminiMultiModale response candidat', candidat);
            const content = candidat.content;
            console.log('GeminiMultiModale response content ', content);
            const parts = content.parts;
            const part0 = parts[0];
            console.log('GeminiMultiModale response part0', part0);
            const textRetour = part0.text;
            console.log('GeminiMultiModale response  text: ', textRetour);
            const obj = JSON.parse(textRetour);
            console.log('GeminiMultiModale   response  parsed object: ', obj);
            const cvItem: CV = new CV();

            cvItem.fileName = file.name;
            cvItem.title = file.name.replace('.pdf', '').substring(0, 40);
            cvItem.file = file;
            cvItem.date = new Date(file.lastModified).toLocaleDateString();
            cvItem.urlFile = URL.createObjectURL(file);
            cvItem.content = obj['cv.content'];
            cvItem.skills = obj['cv.skills'];
            cvItem.companies = obj['cv.societes'];
            cvItem.title = obj['cv.titre'];
            cvItem.resume = obj['cv.resume'];
            cvItem.freelance = obj['cv.freelance'];
            cvItem.langueCV = obj['cv.langues'] ? obj['cv.langues'].join(',') : '';
            cvItem.adresse = obj['cv.adresse'];
            console.log('GeminiMultiModale response  cvItem :', cvItem);
            this.bgIndexedDBService.ajouterCV(cvItem);
            this.cvItems.push(cvItem);
            console.log('Fichier sélectionné cvItem :', cvItem);
            console.log('Fichier sélectionné cvItem :', cvItem.urlFile);
            this.storeCVs();
            this.changeDetectorRef.detectChanges();

          },
          (error) => {
            this.isProcessing = false;
            this.changeDetectorRef.detectChanges();
            console.error('GeminiMultiModale error AA:', error);
            console.error('GeminiMultiModale error BB:', error.error);
            console.error(
              'GeminiMultiModale error CC:',
              error.error?.error || 'no error message'
            );
            this.geminiMultiModale.listModels();
          }
        );
    });
  }

  storeCVs() {
    localStorage.setItem('cvItems', JSON.stringify(this.cvItems));
  }

  deleteCV(cvItem: CV) {
    console.log('deleteCV id ', cvItem.id);
    const index = this.componentCV.cvItems.findIndex(
      (item) => item.id == cvItem.id
    );
    console.log('deleteCV called index', index);

    if (index > -1) {
      this.componentCV.cvItems.splice(index, 1);
    }
    this.bgIndexedDBService.supprimerCV(cvItem.id);
  }

  getCvItemsFromLocalStorage(): CV[] {
    const cvItemsJson = localStorage.getItem('cvItems');
    if (cvItemsJson) {
      const cvItems = JSON.parse(cvItemsJson);
      const listCv: CV[] = cvItems.map((item: any) =>
        Object.assign(new CV(), item)
      );

      return listCv;
    }
    return [];
  }

  getCvItemsFromIndexedDB() {
    const promises: Promise<CV[]> = this.bgIndexedDBService.getCVs();
    promises.then((cvItems) => {
      this.cvItems = cvItems;
      this.changeDetectorRef.detectChanges();
    });
  }

  getCvSelected(): CV {
    if (!this.cvItemSelected) {
      if (this.cvItems.length == 0) {
        throw new Error('No CV selected');
      } else if (this.cvItems.length == 1) {
        this.cvItemSelected = this.cvItems[0];
        this.setCvSelected(this.cvItemSelected);
      } else {
        this.cvItems.forEach((item) => {
          if (item.selected) {
            this.cvItemSelected = item;
          }
        });
      }
    }
    console.log('cvItemSelected:', this.cvItemSelected);
    return this.cvItemSelected;
  }
}

export class CV {
  id!: number;
  content!: string;
  fileName!: string;
  file!: File;
  title!: string;
  date!: string;
  selected: boolean;
  urlFile!: string;
  tags: string[] = [];
  skills: string[] = [];
  companies: string[] = [];
  resume!: string;
  freelance!: boolean;
  langueCV!: string;
  adresse!: string;


  constructor() {
    this.selected = false;
    this.id = Math.floor(Math.random() * 1000000); // Génère un id entre 0 et 999999
  }
}
