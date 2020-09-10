import { Directive, ElementRef, NgModule, OnDestroy, Renderer2, ViewContainerRef } from '@angular/core';
import { tap, delay } from 'rxjs/operators';

import { VideoService } from './video.service';

@Directive({
  selector: 'insert-video',
})
export class InsertVideoDirective implements OnDestroy {

  // viewRef: ViewRef | undefined;

  subscription = this.videoService.append$
    .pipe(
      delay(0)
    )
    .subscribe((componentRef) => {

      // this.viewRef = componentRef.hostView;
      // this.viewContainerRef.insert(componentRef.hostView);
      // console.log(this.elementRef.nativeElement, componentRef.location.nativeElement)

      this.renderer.appendChild(this.elementRef.nativeElement, componentRef.location.nativeElement);
    });

  constructor(
    private videoService: VideoService,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    // private viewContainerRef: ViewContainerRef,
  ) { }

  ngOnDestroy(): void {
    // if (this.viewRef) {
    //   const index = this.viewContainerRef.indexOf(this.viewRef);
    //   this.viewContainerRef.detach(index);
    // }
    this.videoService.append.next();
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
