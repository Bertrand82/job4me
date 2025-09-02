import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'personalisation',
  imports: [FormsModule, CommonModule],
  templateUrl: './component-personalisation.html',
  styleUrl: './component-personalisation.css',
})
export class ComponentPersonalisation {
  personnalite: any;
  personnalites = ['Conventionnel','Créatif', 'Sérieux', 'Dynamique','Atypique'];
  pointA!: string;
  pointB!: string;

  nombreDeMotsMax: number = 100;

  onPersonnaliteChange($event: Event) {
    const select = $event.target as HTMLSelectElement;
    const selectedValue = select.value;
    console.log('Personnalité sélectionnée :', selectedValue);
  }
}
