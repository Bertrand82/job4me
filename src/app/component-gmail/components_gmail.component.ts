import { Component, OnInit } from '@angular/core';
import { JsonPipe,CommonModule ,NgIf } from '@angular/common';
import { GisGmailService } from '../services/gis-gmail.service';
@Component({
  standalone: true,
  selector: 'app-gmail-list',
  imports: [JsonPipe,CommonModule,NgIf],
  template: `
    <div>
      <button (click)="onSignIn()">Sign in</button>
      <button (click)="onSignOut()">Sign out</button>
      <div *ngIf="profile">
        <h3>Connecté : {{ profile.emailAddress }}</h3>
        <p>Messages total: {{ profile.messagesTotal }}</p>
      </div>

      <button (click)="loadMessages()">Charger messages</button>
      <ul>
        <li *ngFor="let m of messages">
          {{ m.id }}
          <button (click)="loadMessage(m.id)">Voir</button>
        </li>
      </ul>

      <pre *ngIf="selectedMessage">{{ selectedMessage | json }}</pre>
    </div>
  `
})
export class GmailListComponent implements OnInit {
  messages: Array<{ id: string; threadId: string }> = [];
  selectedMessage: any = null;
  profile: any = null;

  constructor(private gmail: GisGmailService) {}

  ngOnInit() {
    this.gmail.isSignedIn$.subscribe(s => {
      if (s) {
        this.gmail.getProfile().then(p => this.profile = p).catch(() => {});
      } else {
        this.profile = null;
      }
    });
  }

  onSignIn() {
    console.log('bg00 GmailListComponent onSignIn called');
    this.gmail.signIn('consent').catch(err => console.error("bg01 Erreur lors de la connexion:", err));
  }

  onSignOut() {
    this.gmail.signOut().catch(err => console.error(err));
  }

  loadMessages() {
    this.gmail.listMessages(10).then(res => {
      this.messages = res.messages || [];
    }).catch(err => console.error(err));
  }

  loadMessage(id: string) {
    this.gmail.getMessage(id, 'full').then(m => this.selectedMessage = m).catch(err => console.error(err));
  }
}
