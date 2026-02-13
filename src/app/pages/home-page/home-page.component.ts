import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HeroSectionComponent } from '../../sections/hero-section/hero-section.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [HeroSectionComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {
  private readonly router = inject(Router);

  protected async goToQuestion(): Promise<void> {
    await this.router.navigateByUrl('/question');
  }
}
