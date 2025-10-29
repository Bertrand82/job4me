import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BgAuthService } from 'bg-navigation-auth-stripe';

@Component({
  selector: 'app-component-merci',
  imports: [],
  templateUrl: './component-merci.html',
  styleUrl: './component-merci.css',
})
export class ComponentMerci {
  constructor(private router: Router, private bgAuth: BgAuthService) {}

  ngOnInit() {
    console.log('ComponentStripe ngOnInit');
    this.bgAuth.fetchStripeSessionsByBgUserId1();
  }
  close() {
    this.router.navigate(['']);
  }
}
