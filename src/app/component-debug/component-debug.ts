import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BgAuthService } from '../services/bg-auth-service';
import { PostWithAuthService } from '../services/httpbackend-client-service';

@Component({
  selector: 'component-debug',
  imports: [FormsModule, CommonModule],
  templateUrl: './component-debug.html',
  styleUrl: './component-debug.css'
})
export class ComponentDebug {

  constructor(public bgAuth: BgAuthService,private client: PostWithAuthService) {}

  testPost() {
    const urlTest=           'https://europe-west1-job4you-78ed0.cloudfunctions.net/gemini';
    this.client.postWithAuth(urlTest, { message: 'aaaaa from bg' })
      .then(response => {
        console.log('Response from server:', response);
        alert('Response from server: ' + JSON.stringify(response));
      })
      .catch(error => {
        console.error('bg Error during POST request:', error);
        alert('Error during POST request: \n' + error.message+"\n"+urlTest);
      });
}
}
