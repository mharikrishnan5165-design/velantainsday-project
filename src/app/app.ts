import { Component, ViewChild, ElementRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
@ViewChild('bgMusic') bgMusic!: ElementRef<HTMLAudioElement>;

playMusic() {
  this.bgMusic.nativeElement.volume = 0.5;
  this.bgMusic.nativeElement.play();
}

stopMusic() {
  this.bgMusic.nativeElement.pause();
  this.bgMusic.nativeElement.currentTime = 0; // rewind to start
}
}

