import { PDFDocumentLoadingTask } from './../../../node_modules/pdfjs-dist/types/src/display/api.d';
import { Component } from '@angular/core';

import { ComponentCVItem } from './cv-item/cv-item';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import * as pdfjsLib from 'pdfjs-dist';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-component-cv',
  imports: [ComponentCVItem, CommonModule, FormsModule],
  templateUrl: './component-cv.html',
  styleUrl: './component-cv.css',
})
export class ComponentCV {
  cvContent: string = '';
  componentCV!: ComponentCV;
  cvItemSelected!: CV;
  cvItems: CV[] = [];
  showCvInputTextarea: boolean = false;

  constructor(private changeDetectorRef: ChangeDetectorRef) {
    this.componentCV = this;
    this.cvItems = this.getCvItemsFromLocalStorage();
  }
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      // Ici tu peux vérifier, envoyer ou traiter le fichier PDF sélectionné
      console.log('Fichier sélectionné :', file);
      // Exemple : upload ou lecture du fichier

      const cvItem: CV = new CV();
      this.parsePdf(file, cvItem);
      cvItem.fileName = file.name;
      cvItem.file = file;
      this.cvItems.push(cvItem);
      this.storeCV();
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
    this.storeCV();
  }

  deleteCV(idCv: number) {
    console.log('deleteCV id ', idCv);
    console.log('deleteCV  cvItems', this.cvItems);
    const index = this.cvItems.findIndex((item) => item.id == idCv);
    if (index !== -1) {
      this.cvItems.splice(index, 1);
    }
    console.log('deleteCV  cvItems après suppression', this.cvItems);
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
    console.log('cvItem:', cvItem);
    this.changeDetectorRef.detectChanges();
  }

  storeCV() {
    console.log('storeCV ', this.cvItems);
    localStorage.setItem('cvItems', JSON.stringify(this.cvItems));
  }

  getCvItemsFromLocalStorage(): CV[] {
    const cvItemsJson = localStorage.getItem('cvItems');
    if (cvItemsJson) {
      const cvItems = JSON.parse(cvItemsJson);
      const listCv: CV[] = cvItems.map((item: any) =>
        Object.assign(new CV(), item)
      );
      console;
      return listCv;
    }
    return [];
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
    console.log("cvItemSelected:", this.cvItemSelected);
    return this.cvItemSelected;
  }
}

export class CV {
  id!: number;
  content!: string;
  fileName!: string;
  file!: File;
  title: string = 'CV';
  date: string = '';
  selected = false;
  tags: string[] = [];

  constructor() {
    this.id = Math.floor(Math.random() * 1000000); // Génère un id entre 0 et 999999
  }
}
