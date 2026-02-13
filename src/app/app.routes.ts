import { Routes } from '@angular/router';
import { CuteCardsComponent } from './sections/cute-cards/cute-cards.component';
import { HeroSectionComponent } from './sections/hero-section/hero-section.component';
import { MemoryGalleryComponent } from './sections/memory-gallery/memory-gallery.component';
import { FinalRevealComponent } from './sections/final-reveal/final-reveal.component';
import { QuestionGameComponent } from './sections/question-game/question-game.component';

export const routes: Routes = [
  { path: '', component: HeroSectionComponent },
  { path: 'question', component: QuestionGameComponent },
  { path: 'memories', component: MemoryGalleryComponent },
  { path: 'cards', component: CuteCardsComponent },
  { path: 'final', component: FinalRevealComponent },
  { path: '**', redirectTo: '' }
];
