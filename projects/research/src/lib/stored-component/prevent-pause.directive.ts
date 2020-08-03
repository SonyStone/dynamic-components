import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[preventPause]'
})
export class PreventPauseDirective {

  @HostListener('pause', ['$event.target'])
  preventPause(videoElement: HTMLVideoElement): void {
    videoElement.play();
  }
}