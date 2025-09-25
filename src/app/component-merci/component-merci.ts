import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-component-merci',
  imports: [],
  templateUrl: './component-merci.html',
  styleUrl: './component-merci.css'
})
export class ComponentMerci {

  constructor(private router: Router) {}
   close() {
     this.router.navigate(['']);
  }
}
