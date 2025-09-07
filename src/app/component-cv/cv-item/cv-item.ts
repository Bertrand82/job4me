import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import * as pdfjsLib from 'pdfjs-dist';
import { ComponentCV ,CV} from '../component-cv';
import { MatDialog } from '@angular/material/dialog';
import { CVItemModale } from '../cv-item-modale/cv-item-modale';

@Component({
  selector: 'cv-item',
  imports: [CommonModule,FormsModule],
  templateUrl: './cv-item.html',
  styleUrl: './cv-item.css',
})
export class ComponentCVItem {


  @Input() componentCV!: ComponentCV;

   @Input() cvItem !: CV;




  constructor(private dialog: MatDialog) {
  }



  deleteCV() {
    this.componentCV.deleteCV(this.cvItem);

  }

  telechargerCV() {
    console.log("telechargerCV fileName ", this.cvItem.fileName);
    const link = document.createElement('a');
    link.href = URL.createObjectURL(this.cvItem.file);
    console.log("telechargerCV link ", link);
    link.download = this.cvItem.fileName;

    link.click();
  }

  voirCV() {
    console.log("voirCV file cvitem AA", this.cvItem);
    console.log("voirCV file cvitem BB", this.cvItem.fileName);
    console.log("voirCV file cvitem CC", this.cvItem.file);
    const fileURL = URL.createObjectURL(this.cvItem.file);
    console.log("voirCV fileURL ", fileURL);
    window.open(fileURL);
  }


  selectionnerCV() {
    console.log('selectionnerCV  ', this.cvItem);
    this.componentCV.setCvSelected(this.cvItem);
    this.componentCV.storeCVs();
  }

  displayModale() {
     this.dialog.open(CVItemModale,{data: this.cvItem});
   }
}


