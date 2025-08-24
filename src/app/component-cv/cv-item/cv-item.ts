import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import * as pdfjsLib from 'pdfjs-dist';
import { ComponentCV ,CV} from '../component-cv';

@Component({
  selector: 'cv-item',
  imports: [CommonModule,FormsModule],
  templateUrl: './cv-item.html',
  styleUrl: './cv-item.css',
})
export class ComponentCVItem {



  @Input() componentCV!: ComponentCV;

   @Input() cvItem !: CV;




  constructor() {
  }



  deleteCV() {
    console.log('deleteCV id ', this.cvItem.id);
    console.log('deleteCV  cvItems', this.componentCV.cvItems);
    const index = this.componentCV.cvItems.findIndex(
      (item) => item.id == this.cvItem.id
    );
    console.log('deleteCV called index', index);

    if (index > -1) {
      this.componentCV.cvItems.splice(index, 1);
    }
    this.componentCV.storeCV();
  }

  telechargerCV() {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(this.cvItem.file);
    link.download = this.cvItem.fileName;
    link.click();
  }

  voirCV() {
    const fileURL = URL.createObjectURL(this.cvItem.file);
    window.open(fileURL);
  }


  selectionnerCV() {
    console.log('selectionnerCV id ', this.cvItem.id);
    this.componentCV.setCvSelected(this.cvItem);
  }
}
