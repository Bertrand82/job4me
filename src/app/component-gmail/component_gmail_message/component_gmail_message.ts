import { Component, Input } from '@angular/core';
import { GmailListComponent  } from '../components_gmail_list';
import { FormsModule } from '@angular/forms';
import { ComponentGmailMessageModale } from '../component_gmail_message_modale/component_gmail_message_modale';
import { MatDialog } from '@angular/material/dialog';
import { BgMail } from '../BgMail';

@Component({
  selector: 'component-gmail-message-item',
  imports: [FormsModule],
  templateUrl: './component_gmail_message.html',
  styleUrl: './component_gmail_message.css',
})
export class ComponentGmailMessageItem {
  @Input() gmailListComponent!: GmailListComponent;
  @Input() bgMail!: BgMail;

  constructor(private dialog: MatDialog) {}

  deleteOffreEmploi() {
    console.log('deleteOE id ', this.bgMail.id);
    //this.componentOffreEmploi.deleteOffreEmploi(this.offreEmploi.id);
  }
  voirOffreEmploi() {
  
  }
  displayModale() {
    console.log('bmail', this.bgMail);
    this.openOffreDetail();
  }

  openOffreDetail() {
    this.dialog.open(ComponentGmailMessageModale, {
      data: this.bgMail,
    });
  }

  selectionnerOffreEmploi() {
    this.gmailListComponent.messages.forEach(
      (oe) => (oe.selected = false)
    );
    this.bgMail.selected = true;
  }
}
