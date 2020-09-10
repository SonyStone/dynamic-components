import { ChangeDetectionStrategy, Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';

@Component({
  templateUrl: 'video.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VideoComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor() {
    // console.log(`VideoComponent Created`);
  }

  ngOnInit(): void {
    console.log(`VideoComponent OnInit`);
  }

  ngAfterViewInit(): void {
    console.log(`VideoComponent AfterViewInit`);
  }

  ngOnDestroy(): void {
    console.log(`VideoComponent OnDestroy`);
  }

}