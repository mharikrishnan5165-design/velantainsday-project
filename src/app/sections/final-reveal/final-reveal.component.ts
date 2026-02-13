import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { Router } from '@angular/router';
import { App } from '../../app'


type FloatingItem = {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  blur?: number;
  accent?: string;
};

@Component({
  selector: 'app-final-reveal',
  standalone: true,
  imports: [NgFor],
  templateUrl: './final-reveal.component.html',
  styleUrl: './final-reveal.component.scss'
})
export class FinalRevealComponent {
  protected bubbles: FloatingItem[] = [];

  constructor(private router: Router,private app: App) {
    const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;
    this.bubbles = this.createBubbles(isMobile ? 16 : 30);
  }

  protected replay(): void {
    this.app.stopMusic();
    this.router.navigate(['/']);
  }

  protected trackById(_: number, item: FloatingItem): number {
    return item.id;
  }

  private createBubbles(count: number): FloatingItem[] {
    const palette = ['#ffffff', '#7ad0ff', '#ff8ed5', '#b48bff'];
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: this.rand(4, 96),
      size: this.rand(18, 70),
      duration: this.rand(14, 26),
      delay: this.rand(-16, 0),
      opacity: this.rand(0.18, 0.55),
      blur: this.rand(0, 2.8),
      accent: palette[i % palette.length]
    }));
  }

  private rand(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }
}
