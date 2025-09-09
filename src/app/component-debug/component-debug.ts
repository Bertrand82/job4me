import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BgAuthService } from '../services/bg-auth-service';
import { PostWithAuthService } from '../services/httpbackend-client-service';

@Component({
  selector: 'component-debug',
  imports: [FormsModule, CommonModule],
  templateUrl: './component-debug.html',
  styleUrl: './component-debug.css',
})
export class ComponentDebug {
  constructor(
    public bgAuth: BgAuthService,
    private client: PostWithAuthService
  ) {}

  testPost() {
    const urlTest =
      'https://europe-west1-job4you-78ed0.cloudfunctions.net/gemini';
    //'https://europe-west1-job4you-78ed0.cloudfunctions.net/initadmin';
    this.client
      .postWithAuth(urlTest, { message: 'aaaaa from bg' })
      .then((response: any) => {
        console.log('bg gemini  Response from server:', response);
        if (response !== undefined && response.status !== undefined) {
          console.log('bg gemini  Response from server status:', response.status);
        } else {
          console.log('bg gemini  Response from server: response.status is undefined');
        }
        alert('Response from server: ' + JSON.stringify(response));
      })
      .catch((error) => {
        console.error('bg gemini catch Error during POST request:', error);
         alert('Error during POST request: \n' + error.message + '\n' + urlTest);
      });
  }

  initAdmin() {
    console.log("initAdmin called");
    this.client
      .initAdminBack()
      .then((response) => { console.log('bg initAdmin BINGOOOOO Response from server:', response); })
      .catch((error) => console.error('bg initAdmin request ERROR:', error));
  }
}
