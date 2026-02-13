import { isPlatformBrowser, NgFor, NgIf } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
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
  top?: number;
  rotation?: number;
  accent?: string;
};

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.scss'
})
export class HeroSectionComponent implements OnInit, OnDestroy {
  protected bubbles: FloatingItem[] = [];
  protected hearts: FloatingItem[] = [];
  protected petals: FloatingItem[] = [];

  protected isLocked = true;
  protected countdownText = '';

  private unlockAt: Date | null = null;
  private countdownIntervalId: ReturnType<typeof setInterval> | null = null;

  constructor(private app: App,
    @Inject(PLATFORM_ID) platformId: object,
    private router: Router
  ) {
    const isBrowser = isPlatformBrowser(platformId);
    const isMobile = isBrowser ? window.matchMedia('(max-width: 640px)').matches : false;

    this.bubbles = this.createBubbles(isMobile ? 14 : 34);
    this.hearts = this.createHearts(isMobile ? 5 : 10);
    this.petals = this.createPetals(isMobile ? 9 : 18);
  }

ngOnInit(): void {
  if (typeof window === 'undefined') return;

  this.unlockAt = this.getToday11AM();

  // If already past 11:00 AM, do not lock
  if (new Date() >= this.unlockAt) {
    this.isLocked = false;
    return;
  }

  this.isLocked = true;
  this.updateCountdown();

  this.countdownIntervalId = setInterval(() => {
    this.updateCountdown();
  }, 1000);

  document.body.style.overflow = 'hidden';
}


  ngOnDestroy(): void {
    if (this.countdownIntervalId) {
      clearInterval(this.countdownIntervalId);
    }
    document.body.style.overflow = '';
  }

  private getToday11AM(): Date {
  const now = new Date();
  const today11 = new Date(now);
  today11.setHours(11, 0, 0, 0);
  return today11;
}


  private updateCountdown(): void {
    if (!this.unlockAt) return;
    const now = new Date();
    if (now >= this.unlockAt) {
      this.isLocked = false;
      this.countdownText = '';
      document.body.style.overflow = '';
      if (this.countdownIntervalId) {
        clearInterval(this.countdownIntervalId);
        this.countdownIntervalId = null;
      }
      return;
    }
    const ms = this.unlockAt.getTime() - now.getTime();
    const s = Math.floor((ms / 1000) % 60);
    const m = Math.floor((ms / 1000 / 60) % 60);
    const h = Math.floor(ms / 1000 / 60 / 60);
    this.countdownText = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  startExperience() {
  this.app.playMusic();
  this.goToQuestion();
  }

  protected goToQuestion(): void {
    this.router.navigate(['/question']);
  }

  protected trackById(_: number, item: FloatingItem): number {
    return item.id;
  }

  private createBubbles(count: number): FloatingItem[] {
    const palette = ['#ffffff', '#ff5fb8', '#66d6ff', '#b48bff'];
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: this.rand(2, 98),
      size: this.rand(14, 58),
      duration: this.rand(14, 28),
      delay: this.rand(-18, 0),
      opacity: this.rand(0.14, 0.36),
      blur: this.rand(0, 2.2),
      accent: palette[i % palette.length]
    }));
  }

  private createHearts(count: number): FloatingItem[] {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: this.rand(5, 95),
      top: this.rand(8, 86),
      size: this.rand(16, 48),
      duration: this.rand(10, 18),
      delay: this.rand(-10, 0),
      opacity: this.rand(0.14, 0.45),
      blur: this.rand(0, 1.2)
    }));
  }

  private createPetals(count: number): FloatingItem[] {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: this.rand(0, 100),
      size: this.rand(10, 22),
      duration: this.rand(8, 15),
      delay: this.rand(-12, 0),
      opacity: this.rand(0.18, 0.55),
      rotation: this.rand(-25, 25)
    }));
  }

  private rand(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }
}
