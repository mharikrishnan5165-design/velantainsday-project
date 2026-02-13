import {isPlatformBrowser , NgIf } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild, PLATFORM_ID, Inject, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import Typed from 'typed.js';
import { HttpClient } from '@angular/common/http';

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
  selector: 'app-question-game',
  standalone: true,
  imports: [NgIf],
  templateUrl: './question-game.component.html',
  styleUrl: './question-game.component.scss',
})
export class QuestionGameComponent implements AfterViewInit {

  @ViewChild('qText') qText!: ElementRef<HTMLElement>;

  answers: { question: string; answer: string }[] = [];

  questions = [
    'ne ena mannippana yes click pannu, ilana no click pannu',
    'ini na ithu mari pana maten, sorry 😒',
    'enaku purithu intha edathula nana iruntha evlo kova patturupen, enalam panirupen nu enaku nala purithu, na unarnthuten ini intha mari pana maten nammbu 😒',
    'nethu lam na na yen panen nu lam yositutha irunthen, ona pathi entha kavalaium illama iruken nu nenaikkatha, yosipen neraya',
    'un life pathilam yosippen, ona pathi yosippen, unkuda irukka mari lam neraya yosippen unta avlova sonathu ila athanala ona na ona pathi yosikatha mari irukkum.',
    'ena manuchutta na yes kuthu ulla po ✨, illa na no kuduthuru 😒'
  ];

  trapQuestions = [1,3];
  protected bubbles: FloatingItem[] = [];
  currentIndex = 0;
  completed = false;
  noButtonClicked = false;

  private typed?: Typed;

  constructor(@Inject(PLATFORM_ID) platformId: object,private router: Router, private http: HttpClient, private cdr: ChangeDetectorRef) {

    const isBrowser = isPlatformBrowser(platformId);
    const isMobile = isBrowser ? window.matchMedia('(max-width: 640px)').matches : false;
    this.bubbles = this.createBubbles(isMobile ? 14 : 34);
  }

  ngAfterViewInit() {
    this.typeQuestion();
  }

  private typeQuestion() {

        console.log('Typing question at index:', this.noButtonClicked);


    if(this.noButtonClicked){
       this.currentIndex = 0;
    }

        console.log('Typing question at index:', this.currentIndex);


    if (!this.qText || !this.qText.nativeElement) {
      return;
    }

    if (this.typed) this.typed.destroy();

    this.qText.nativeElement.innerHTML = '';

    this.typed = new Typed(this.qText.nativeElement, {
      strings: [this.questions[this.currentIndex]],
      typeSpeed: 45,
      showCursor: false
    });
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

   protected trackById(_: number, item: FloatingItem): number {
    return item.id;
  }
  onYes() {
    this.noButtonClicked = false; // Reset flag when Yes is clicked
    this.cdr.detectChanges(); // Ensure view updates before accessing qText
    this.saveAnswer('YES');

    if (this.currentIndex >= this.questions.length) {
      this.completed = true;
      return;
    }

    setTimeout(() => {
      this.typeQuestion();
    }, 0);
  }

  onNo() {
    this.noButtonClicked = true;
    this.saveAnswer('NO');

    if (this.currentIndex >= this.questions.length) {
      this.completed = true;
      return;
    }

    this.typeQuestion();
  }

  private saveAnswer(answer: string) {

  this.answers.push({
    question: this.questions[this.currentIndex],
    answer
  });

  this.currentIndex++;

  if (this.currentIndex >= this.questions.length) {
    this.completed = true;
    this.sendToApi();
    return;
  }

  this.cdr.detectChanges(); // Ensure view updates before accessing qText
  setTimeout(() => {
    this.typeQuestion();
  }, 0);
}

sendToApi() {
  const message = this.answers
    .map((a, i) => `${i + 1}. ${a.question}\nAnswer: ${a.answer}`)
    .join('\n\n');

  const payload = {
    name: 'DINESHKUMAR',
    fromEmail: 'narmu@gmail.com',
    number: '7806862126',
    message: message
  };

  this.http.post(
    'https://api.dntechs.in/contact/send/message',
    payload
  ).subscribe({
    next: res => console.log('Sent ✅', res),
    error: err => console.error('Error ❌', err)
  });
}

  isNoBlocked(): boolean {
    return this.trapQuestions.includes(this.currentIndex);
  }

  async continueToMemories() {
    await this.router.navigateByUrl('/memories');
  }

  private rand(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }
}