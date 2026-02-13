import { Component } from '@angular/core';
import { CuteCardsComponent } from '../../sections/cute-cards/cute-cards.component';

@Component({
  selector: 'app-cards-page',
  standalone: true,
  imports: [CuteCardsComponent],
  templateUrl: './cards-page.component.html',
  styleUrl: './cards-page.component.scss'
})
export class CardsPageComponent {}
