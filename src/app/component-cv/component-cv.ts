import { PDFDocumentLoadingTask } from './../../../node_modules/pdfjs-dist/types/src/display/api.d';
import { Component } from '@angular/core';

import { ComponentCVItem } from './cv-item/cv-item';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import * as pdfjsLib from 'pdfjs-dist';
import { ChangeDetectorRef } from '@angular/core';
import { BgIndexedDBService } from '../services/bg-indexed-db';
import { BgGemini, reponseAnalyseCV } from '../services/bg-gemini';
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

  constructor(
    private bgIndexedDBService: BgIndexedDBService,
    private changeDetectorRef: ChangeDetectorRef,
    private gemini: BgGemini
  ) {
    this.componentCV = this;
  }

  ngOnInit() {
    this.getCvItemsFromIndexedDB();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.processPdfFileInput(file);
      this.processCVFileByGemini2(file);
    }
  }

  processPdfFileInput(file: File) {
    // Ici tu peux vérifier, envoyer ou traiter le fichier PDF sélectionné
    console.log('Fichier sélectionné :', file);
    // Exemple : upload ou lecture du fichier

    const cvItem: CV = new CV();

    cvItem.fileName = file.name;
    cvItem.title = file.name.replace('.pdf', '').substring(0, 40);
    cvItem.file = file;
    cvItem.date = new Date(file.lastModified).toLocaleDateString();
    cvItem.urlFile = URL.createObjectURL(file);
    this.bgIndexedDBService.ajouterCV(cvItem);
    this.cvItems.push(cvItem);
    console.log('Fichier sélectionné cvItem :', cvItem);
    console.log('Fichier sélectionné cvItem :', cvItem.urlFile);
    this.storeCVs();
    this.parsePdf(file, cvItem);
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

  async parsePdf(file: File, cvItem: CV) {
    // *** IMPORTANT : configure le worker AVANT toute opération ***
    (pdfjsLib as any).GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs';
    // Lis le fichier PDF en ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // (Optionnel mais conseillé) Configure le worker de pdf.js si besoin :
    // (pdfjsLib as any).GlobalWorkerOptions.workerSrc = 'node_modules/pdfjs-dist/build/pdf.worker.js';

    // Charge le document PDF
    const loadingTask = (pdfjsLib as any).getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;

    let fullText = '';

    // Parcours toutes les pages
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items.map((item: any) => item.str);
      fullText += strings.join(' ') + '\n';
    }
    console.log('Texte extrait du PDF :', fullText);

    cvItem.content = fullText; // Stocke le texte extrait dans cvContent
    cvItem.title = file.name.replace('.pdf', '').substring(0, 40); // Stocke le nom du fichier dans cvTitlefile.name;
    const lastModified = file.lastModified; // timestamp en ms
    const lastModifiedDate = new Date(lastModified);

    // Afficher sous forme lisible

    const dateLastModified = new Date(file.lastModified);
    cvItem.date = dateLastModified.toLocaleDateString();

    this.changeDetectorRef.detectChanges();
    this.storeCVs();
    this.bgIndexedDBService.updateCV(cvItem);
    this.processCVByGemini(cvItem);
  }
  processCVByGemini(cvItem: CV) {
    console.log('Processing CV by Gemini:', cvItem);
    console.log('Processing CV by Gemini:', cvItem.content);
    const prompt = 'Analyse ce cv :' + cvItem.content;
    this.gemini.generateContent(prompt, reponseAnalyseCV).subscribe(
      (res) => {
        console.log('Gemini response:', res);
        const candidat = res.candidates[0];

        console.log('Gemini response candidat', candidat);
        const content = candidat.content;
        console.log('Gemini response content ', content);
        const parts = content.parts;
        const part0 = parts[0];
        console.log('Gemini response part0', part0);
        const textRetour = part0.text;
        console.log('Gemini response  text: ', textRetour);
        const obj = JSON.parse(textRetour);
        console.log('Gemini response  parsed object: ', obj);
        cvItem.title = obj['cv.titre'];
        cvItem.skills = obj['cv.skills'];
        cvItem.companies = obj['cv.societes'];
        this.changeDetectorRef.detectChanges();
        this.bgIndexedDBService.updateCV(cvItem);
      },
      (error) => {
        console.error('Gemini error:', error);
      }
    );
  }

  processCVFileByGemini2(file: File) {
    console.log('Processing CV by Gemini2:', file);
    console.log('Processing CV by Gemini2:', file.name);
    const prompt = 'Quel est le contenu de ce cv   :' ;
    this.gemini.generateContent(prompt, reponseAnalyseCV).subscribe(
      (res) => {
        console.log('Gemini response:', res);
        const candidat = res.candidates[0];

        console.log('Gemini response candidat', candidat);
        const content = candidat.content;
        console.log('Gemini response content ', content);
        const parts = content.parts;
        const part0 = parts[0];
        console.log('Gemini response part0', part0);
        const textRetour = part0.text;
        console.log('Gemini response  text: ', textRetour);
        const obj = JSON.parse(textRetour);
        console.log('Gemini response  parsed object: ', obj);

        this.changeDetectorRef.detectChanges();

      },
      (error) => {
        console.error('Gemini error:', error);
      }
    );
  }


  storeCVs() {
    console.log('storeCV ', this.cvItems);
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

  constructor() {
    this.selected = false;
    this.id = Math.floor(Math.random() * 1000000); // Génère un id entre 0 et 999999
  }
}
