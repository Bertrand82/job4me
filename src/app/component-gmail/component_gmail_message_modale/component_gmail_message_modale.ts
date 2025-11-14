import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BgMail } from '../BgMail';

@Component({
  selector: 'gmail-message-detail-modale',
  templateUrl: './component_gmail_message_modale.html',
  styleUrls: ['./component_gmail_message_modale.css'],
})
export class ComponentGmailMessageModale {

  constructor(
    public dialogRef: MatDialogRef<ComponentGmailMessageModale>,
    @Inject(MAT_DIALOG_DATA) public data: BgMail // Data passée à la modale
  ) {
    console.log('Modale constructor data:', data);
  }

  onClose(): void {
    this.dialogRef.close();
  }

  processOffreEmploi() {
    //window.open(this.data.url, '_blank');
  }
}
