import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {  CommonModule, NgIf } from '@angular/common';
import { GisGmailService } from '../services/gis-gmail.service';
import { BgGemini } from '../services/bg-gemini';
import { BgMail } from './BgMail';
import { ComponentGmailMessageItem } from './component_gmail_message/component_gmail_message';
@Component({
  standalone: true,
  selector: 'app-gmail-list',
  imports: [ CommonModule, NgIf, ComponentGmailMessageItem],
  templateUrl: './components_gmail_list.html',
  styleUrls: ['./components_gmail_list.css']
})

export class GmailListComponent implements OnInit {
  messages: Array<BgMail> = [];
  selectedMessage: any = null;
  profile: any = null;
 componentGmailList: any;

  constructor(
    private gmail: GisGmailService,
    private changeDetectorRef: ChangeDetectorRef,
    private gemini: BgGemini
  ) { this.componentGmailList=this}

  ngOnInit() {
    this.gmail.isSignedIn$.subscribe((s) => {
      if (s) {
        this.gmail
          .getProfile()
          .then((p) => (this.profile = p))
          .catch(() => { });
      } else {
        this.profile = null;
      }
    });
  }

  onSignIn() {
    console.log('bg00 GmailListComponent onSignIn called');
    this.gmail
      .signIn('consent')
      .catch((err) => console.error('bg01 Erreur lors de la connexion:', err));
  }

  onSignOut() {
    this.gmail.signOut().catch((err) => console.error(err));
  }

  loadMessages() {
    this.gmail
      .listMessages(10)
      .then((res) => {
        if (res.messages) {
          this.messages = res.messages.map((m) => new BgMail(m.id));
        }
      })
      .catch((err) => console.error(err));
    this.changeDetectorRef.detectChanges();
  }

  processMessages() {
    const messagesToday = this.loadMessagesToday();
    messagesToday.forEach((m) => {
      this.processMessage(m.id);
    });
  }
  processMessage(idMessage: string) {
    this.gmail
      .getMessage(idMessage, 'full')
      .then((m) => this.processMessageDetailsByGemini(m))
      .catch((err) => console.error('processMessage:', err));
  }
  processMessageDetailsByGemini(msg2: any): any {
    console.log('processMessageDetails m:', msg2);

    const index = this.messages.findIndex((m) => m.id === msg2.id);
    if (index === -1) {
      console.error(
        'processMessageDetailsByGemini: message not found in list id=', msg2.id
      );
      return;
    }
    const message = this.messages[index];
    message.setFrom(this.extractHeader(msg2, 'From') || '');    
    message.to = this.extractHeader(msg2, 'To') || '';    
    message.subject = this.extractHeader(msg2, 'Subject') || '';
    message.snippet = msg2.snippet || '';
    message.bodyTxt = this.getPlainTextFromMessage(msg2, 3000); // tronque à 3000 chars
  
    // build prompt
    if (!message.isConsistent()){
      console.log('Message non consistent, skipping Gemini analysis id=', message);
      return;
    }
    const prompt = this.buildGeminiPrompt(message.subject, message.snippet, message.bodyTxt);
    console.log('processMessageDetails prompt:', prompt);
    this.changeDetectorRef.detectChanges();
    ///
    this.gemini.generateContent(prompt, reponseAnalyseGmail).subscribe({
      next: (res) => {
        console.log('responseRequestGemini msg A' + msg2.id + ' res:', res);
        console.log(
          'responseRequestGemini msg B' + message.id + ' geminiData:',
          res.geminiData
        );
        if(res.geminiData.error){
          console.error('Erreur Gemini pour le message id=' + message.id + ' :', res.geminiData.error);
          this.changeDetectorRef.detectChanges();
          return;
        }
        console.log('candidates', res.geminiData.candidates);
        const candidat = res.geminiData.candidates[0];

        console.log('candidat', candidat);
        const content = candidat.content;
        console.log('content ', content);
        const parts = content.parts;
        const part0 = parts[0];
        console.log('part0', part0);
        const textRetour = part0.text;
        console.log('text: ', textRetour);
        const geminiResponse = JSON.parse(textRetour);
        console.log('obj: ', geminiResponse);
        
        // this.messages.push(messageBgMail);
        // mettre à jour la liste des messages avec la réponse Gemini
        
        message.geminiResponse = geminiResponse;
        this.changeDetectorRef.detectChanges();
        //t
      },
      error: (err) => {
        console.log('responseRequest', err);
        console.log('errA', err);
        console.log('err.message', err.message);
        console.log('err.error', err.error);
        console.log('err.error.error', err.error.error);
        console.log('err.error.error.message', err.error.error.message);
        this.changeDetectorRef.detectChanges();
      },
    });

    ///
  }

  // helpers
  private extractHeader(msg: any, name: string): string | null {
    const headers = msg.payload?.headers || [];
    const h = headers.find(
      (hh: any) => hh.name?.toLowerCase() === name.toLowerCase()
    );
    return h ? h.value : null;
  }


  private getPlainTextFromMessage(msg: any, maxLen = 2000): string {
    // try to extract text/plain parts, fallback to stripping HTML
    const payload = msg.payload;
    let text = '';

    const traverse = (part: any) => {
      if (!part) return;
      if (part.mimeType === 'text/plain' && part.body?.data) {
        text += this.decodeBase64Url(part.body.data) + '\n';
      } else if (part.mimeType === 'text/html' && part.body?.data && !text) {
        const html = this.decodeBase64Url(part.body.data);
        text += this.stripHtml(html) + '\n';
      } else if (part.parts && part.parts.length) {
        part.parts.forEach((p: any) => traverse(p));
      }
    };
    traverse(payload);
    return text ? text.slice(0, maxLen) : '';
  }

  private decodeBase64Url(b64: string): string {
    // Gmail uses base64url
    const fixed = b64.replace(/-/g, '+').replace(/_/g, '/');
    try {
      return decodeURIComponent(escape(window.atob(fixed)));
    } catch {
      return window.atob(fixed);
    }
  }

  private stripHtml(html: string) {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }

  private buildGeminiPrompt(subject: string, snippet: string| undefined, body: string) {
    const template = `
Tu es un extracteur d'offres d'emploi. Réponds uniquement par du JSON strict conforme au schema fourni.
Message:
Subject: ${subject}
Snippet: ${snippet}
Body:
${body}
`;
    return template;
  }

  loadMessagesToday() {
    const now = new Date();
    // début de la journée locale
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0,
      0
    );
    // début du jour suivant
    const startOfNextDay = new Date(startOfDay);
    startOfNextDay.setDate(startOfNextDay.getDate() + 1);

    const startSeconds = Math.floor(startOfDay.getTime() / 1000);
    const endSeconds = Math.floor(startOfNextDay.getTime() / 1000);

    const q = `after:${startSeconds} before:${endSeconds}`;

    // demande au service en lui passant la query
    this.gmail
      .listMessages(100, q)
      .then((res) => {
        const msgs = res.messages || [];
        this.messages = msgs.map((m: any) => new BgMail(m.id));
      })
      .catch((err) => console.error(err));
    this.changeDetectorRef.detectChanges();
    return this.messages;
  }

  loadMessage_DEPRECATED(id: string) {
    this.gmail
      .getMessage(id, 'full')
      .then((m) => (this.selectedMessage = m))
      .catch((err) => console.error(err));
  }

  checkMessage(id: string) {
    console.log('checkMessage id:', id);
    const message = this.messages.find((m) => m.id === id);
    console.log('checkMessage message:', message);
  }

  openMessage(m: BgMail) {
    // Exemple : naviguer ou sélectionner
    console.log('open message', m.id);
    // this.router.navigate(['/messages', m.id]) ou autre logique
  }
}



export const reponseAnalyseGmail = {
  type: 'object',
  properties: {
   
    company: {
      type: 'string',
      maxLength: 80,
      description: 'nom de la société',
    },
    position: {
      type: 'string',
      maxLength: 80,
      description: 'intitulé du poste',
    },
    salary: { type: 'string', maxLength: 80, description: 'salaire proposé' },
    location: { type: 'string', maxLength: 80, description: 'lieu du poste' },
    contact: {
      type: 'string',     
      description: 'personne à contacter',
    },
    applyLink: {
      type: 'string',
      maxLength: 200,
      description: 'lien pour postuler',
    },
    offerDate: {
      type: 'string',
      format: 'date-time',
      description: "date de l'offre",
    },
    extraNotes: {
      type: 'string',
      maxLength: 300,
      description: 'notes supplémentaires',
    },
    confidence: {
      type: 'number',
      description: "niveau de confiance de l'analyse (0 à 1)",
    },
    nbOffresEmplois: {
      type: 'number',
      description: "nombre d'offres d'emplois détectées dans le mail (0 si aucune)",
    },
     // Nouveau champ "label" : une seule valeur choisie parmi une énumération de labels
    label: {
      type: 'string',
      enum: [
        'jobOffer',       // une seule offre d'emploi
        'jobOffers',      // plusieurs offres listées dans le même mail
        'advertisement',  // publicité / promo
        'contactRequest', // prise de contact / demande de contact
        'bank',           // communication bancaire (ex: relevé, alerte)
        'newsletter',     // newsletter non personnelle
        'invoice',        // facture
        'other'           // autre / indéterminé
      ],
      description:
        "Catégorie principale du mail. Utiliser une valeur parmi l'énumération (jobOffer, jobOffers, advertisement, contactRequest, bank, newsletter, invoice, other).",
    },
  },
  required: [ 'nbOffresEmplois', 'label', 'confidence'],
};
