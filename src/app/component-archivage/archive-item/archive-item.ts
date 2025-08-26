import { ArchiveLettre, ComponentArchivage } from './../component-archivage';
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-archive-item',
  imports: [CommonModule, FormsModule,CommonModule],
  templateUrl: './archive-item.html',
  styleUrl: './archive-item.css'
})
export class ArchiveItem {
telechargerArchiveLettre() {
throw new Error('Method not implemented.');
}
deleteArchiveLettre() {
throw new Error('Method not implemented.');
}
voirArchiveLettre() {
throw new Error('Method not implemented.');
}
  @Input() archiveLettre!: ArchiveLettre;
  @Input() componentArchivage!: ComponentArchivage;
}
