import { PDFDocumentLoadingTask } from './../../../node_modules/pdfjs-dist/types/src/display/api.d';
import { Component } from '@angular/core';
import * as pdfjsLib from 'pdfjs-dist';

@Component({
  selector: 'app-component-cv',
  imports: [],
  templateUrl: './component-cv.html',
  styleUrl: './component-cv.css',
})
export class ComponentCV {

  cvContent: string = '';
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      // Ici tu peux vérifier, envoyer ou traiter le fichier PDF sélectionné
      console.log('Fichier sélectionné :', file);
      // Exemple : upload ou lecture du fichier
      this.parsePdf(file);
    }
  }

  async parsePdf(file: File) {
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
    this.cvContent = fullText; // Stocke le texte extrait dans cvContent
    // Tu peux maintenant utiliser fullText comme tu veux (affichage, analyse, etc.)
  }

  onTextareaChange($event: Event) {
    const textarea = $event.target as HTMLTextAreaElement;
    const content = textarea.value;
    console.log('Contenu du textarea :', content);
    this.cvContent = content; // Met à jour cvContent avec le contenu du textarea
  }
}

