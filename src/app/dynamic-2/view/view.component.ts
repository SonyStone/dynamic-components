import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import defer from 'raw-loader!./defer.html';
import docs from 'raw-loader!./docs.html';
import instruction from 'raw-loader!./instruction.html';
import template2 from 'raw-loader!./template-2.html';
import test1 from 'raw-loader!./test-1.html';
import test2 from 'raw-loader!./test-2.html';

const templates = [
  { id: 'test-1', contents: test1, },
  { id: 'test-2', contents: test2, },
  { id: 'template-2', contents: template2, },
  { id: 'defer', contents: defer, },
  { id: 'docs', contents: docs, },
  { id: 'instruction', contents: instruction, },
];

@Component({
  selector: 'app-view',
  templateUrl: 'view.component.html',
  styleUrls: ['view.component.scss'],
  providers: [

  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewComponent {

  private count = 4;
  currentDocument = templates[this.count];

  constructor(
    private cd: ChangeDetectorRef,
  ) {}

  next(): void {
    this.change('next');
  }

  previous(): void {
    this.change('previous');
  }

  private change(direction: 'next' | 'previous'): void {
    const maxCount = (templates.length - 1);

    this.count = (direction === 'next')
      ? (this.count === maxCount)
        ? 0
        : ++this.count
      : (this.count === 0)
        ? maxCount
        : --this.count;

    this.currentDocument = templates[this.count];
    this.cd.markForCheck();
  }
}
