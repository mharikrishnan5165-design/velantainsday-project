import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import Typed from 'typed.js';

@Component({
  selector: 'app-cute-cards',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './cute-cards.component.html',
  styleUrl: './cute-cards.component.scss'
})
export class CuteCardsComponent {
  @ViewChild('msg') msgRef!: ElementRef<HTMLElement>;
  protected bubbles: FloatingBubble[] = [];
  private typed?: Typed;

  constructor(private cdr: ChangeDetectorRef, private router: Router) {
    const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches;
    this.bubbles = this.createBubbles(isMobile ? 16 : 28);
      setTimeout(() => {
    this.typeMessage(this.messages[0]);
  }, 200);
  }

 protected readonly messages: string[] = [
  'From the day you came into my life, everything started feeling lighter. Your smile has this magic that makes even ordinary moments special. On your birthday, I just want you to know how important you are to me.',
  'I may not say it every day, but you mean a lot to me. Your happiness matters to me more than you think. If there’s ever a moment you feel low, remember there’s someone who genuinely cares for you.',
  'No matter what happens in life, I wish to always see you smiling and peaceful. I’ll always be there for you in whatever way I can, because you deserve all the good things this world has to offer.',
  'Happy Birthday to someone truly special. May this year bring you beautiful memories, warm moments, and endless reasons to smile. Stay happy, stay amazing — you mean more than words can explain.'
];

private typeMessage(message: string) {
  setTimeout(() => {
    if (this.typed) this.typed.destroy();

    if (!this.msgRef) return;

    this.msgRef.nativeElement.innerHTML = '';

    this.typed = new Typed(this.msgRef.nativeElement, {
      strings: [message],
      typeSpeed: 28,
      showCursor: false
    });
  }, 50);
}

  protected currentIndex = 0;
  protected isAnimating = false;
  protected exitDirection: 'left' | 'right' | null = null;
  protected isEntering = false;
  protected previousMessage: string | null = null;

  protected get currentMessage(): string | null {
    return this.messages[this.currentIndex] ?? null;
  }

  protected get hasMoreCards(): boolean {
    return this.currentIndex < this.messages.length;
  }

  protected readonly heartPositions = [
    { top: '8%', left: '12%', delay: '0s', size: '12px' },
    { top: '15%', right: '8%', left: 'auto', delay: '0.8s', size: '10px' },
    { top: '75%', left: '6%', delay: '1.2s', size: '8px' },
    { top: '82%', right: '14%', left: 'auto', delay: '0.4s', size: '11px' },
    { top: '45%', left: '4%', delay: '2s', size: '9px' },
    { top: '52%', right: '6%', left: 'auto', delay: '1.5s', size: '10px' }
  ];

  protected onCardClick(): void {
  if (this.isAnimating || !this.hasMoreCards) return;

  this.isAnimating = true;
  this.previousMessage = this.currentMessage;
  this.exitDirection = this.currentIndex % 2 === 0 ? 'right' : 'left';
  this.currentIndex++;
  this.isEntering = this.hasMoreCards;
  if (this.currentIndex < this.messages.length) {
    this.typeMessage(this.messages[this.currentIndex]);
  }

  setTimeout(() => {
    this.exitDirection = null;
    this.isAnimating = false;
    this.isEntering = false;
    this.cdr.detectChanges();
  }, 600); 
}

  protected goToFinal(): void {
    this.router.navigate(['/final']);
  }

  protected trackById(_: number, item: FloatingBubble): number {
    return item.id;
  }

  private createBubbles(count: number): FloatingBubble[] {
    const palette = ['#ffffff', '#7ad0ff', '#ff8ed5', '#b48bff'];
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: this.rand(4, 96),
      size: this.rand(18, 70),
      duration: this.rand(14, 26),
      delay: this.rand(-16, 0),
      opacity: this.rand(0.18, 0.55),
      blur: this.rand(0, 2.6),
      accent: palette[i % palette.length]
    }));
  }

  private rand(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }
}

type FloatingBubble = {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  blur?: number;
  accent?: string;
};
