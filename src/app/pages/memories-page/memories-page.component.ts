import { Component } from '@angular/core';
import { MemoryGalleryComponent } from '../../sections/memory-gallery/memory-gallery.component';

@Component({
  selector: 'app-memories-page',
  standalone: true,
  imports: [MemoryGalleryComponent],
  templateUrl: './memories-page.component.html',
  styleUrl: './memories-page.component.scss'
})
export class MemoriesPageComponent {}

