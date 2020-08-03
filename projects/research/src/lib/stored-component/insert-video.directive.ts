import { Directive, ElementRef, NgModule, OnDestroy, Renderer2 } from '@angular/core';
import { delay } from 'rxjs/operators';

import { VideoService } from './video.service';

@Directive({
  selector: 'insert-video',
})
export class InsertVideoDirective implements OnDestroy {

  subscription = this.videoService.append$
    // .pipe(
    //   delay(1000),
    // )
    .subscribe((componentRef) => {
      this.renderer.appendChild(this.elementRef.nativeElement, componentRef.location.nativeElement);
    })

  constructor(
    private videoService: VideoService,
    private renderer: Renderer2,
    private elementRef: ElementRef,
  ) { }

  ngOnDestroy(): void {
    console.log(`insert-video ngOnDestroy`);
    this.videoService.append.next(1312);
    this.subscription.unsubscribe();
  }
}

@NgModule({
  imports: [],
  declarations: [
    InsertVideoDirective,
  ],
  exports: [
    InsertVideoDirective,
  ],
})
export class InsertVideoModule { }
