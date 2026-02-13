import { isPlatformBrowser, NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';

type GalleryImage = {
  src: string;
  alt: string;
  delay: string;
  duration: string;
  driftX: string;
  driftY: string;
};

@Component({
  selector: 'app-memory-gallery',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './memory-gallery.component.html',
  styleUrl: './memory-gallery.component.scss'
})
export class MemoryGalleryComponent implements OnInit, OnDestroy {
  protected readonly images: GalleryImage[] = this.buildImages();

  protected isMobile = false;
  protected currentIndex = 0;
  protected prevIndex = 0;
  protected flip = false;

  private readonly isBrowser: boolean;
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private mql: MediaQueryList | null = null;
  private mqlHandler: ((e: MediaQueryListEvent) => void) | null = null;

  constructor(
    @Inject(PLATFORM_ID) platformId: object,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) return;

    this.mql = window.matchMedia('(max-width: 767.98px)');
    this.isMobile = this.mql.matches;

    this.mqlHandler = (e: MediaQueryListEvent) => {
      this.isMobile = e.matches;
      this.resetSlideshow();
    };
    this.mql.addEventListener('change', this.mqlHandler);

    this.resetSlideshow();

    document.addEventListener('contextmenu', (e) => e.preventDefault());

  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.mql && this.mqlHandler) {
      this.mql.removeEventListener('change', this.mqlHandler);
    }
  }

  protected trackBySrc(_: number, item: GalleryImage): string {
    return item.src;
  }

  protected goToCards(): void {
    this.router.navigate(['/cards']);
  }

  protected nextMobileImage(): void {
    if (!this.isMobile || this.images.length <= 1) return;
    this.prevIndex = this.currentIndex;
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.flip = !this.flip;
    this.cdr.detectChanges();
  }

  private buildImages(): GalleryImage[] {
    const sources = [
      { src: '/gallery/6.jpg', alt: 'Beautiful memory 1' },
      { src: '/gallery/1.jpeg', alt: 'Beautiful memory 2' },
      { src: '/gallery/4.jpeg', alt: 'Beautiful memory 3' },
      { src: '/gallery/3.jpeg', alt: 'Beautiful memory 4' },
      { src: '/gallery/9.jpg', alt: 'Beautiful memory 5' },
      { src: '/gallery/2.jpeg', alt: 'Beautiful memory 6' },
      { src: '/gallery/5.jpg', alt: 'Beautiful memory 7' },
      { src: '/gallery/7.jpg', alt: 'Beautiful memory 8' },
      { src: '/gallery/10.jpg', alt: 'Beautiful memory 9' },
      { src: '/gallery/8.jpg', alt: 'Beautiful memory 10' }
    ];

    return sources.map((img, i) => {
      const a = this.seed(i + 1);
      const b = this.seed(i + 101);
      const c = this.seed(i + 1001);

      const duration = this.range(14, 22, a);
      const delay = -this.range(0, 10, b);
      const driftX = this.range(10, 26, c);
      const driftY = this.range(8, 20, this.seed(i + 2001));

      return {
        src: img.src,
        alt: img.alt,
        duration: `${duration.toFixed(2)}s`,
        delay: `${delay.toFixed(2)}s`,
        driftX: `${driftX.toFixed(0)}px`,
        driftY: `${driftY.toFixed(0)}px`
      };
    });
  }

  private seed(n: number): number {
    const x = Math.sin(n * 999.123) * 10000;
    return x - Math.floor(x);
  }

  private range(min: number, max: number, t: number): number {
    return min + (max - min) * t;
  }

  private resetSlideshow(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.prevIndex = this.currentIndex;

    if (!this.isMobile || this.images.length <= 1) return;

    this.intervalId = setInterval(() => this.nextMobileImage(), 4000);
  }
}
