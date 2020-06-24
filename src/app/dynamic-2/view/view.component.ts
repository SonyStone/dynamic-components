import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { DocumentContents } from 'doc-viewer';
import defer from 'raw-loader!./defer.html';
import docs from 'raw-loader!./docs.html';
import instruction from 'raw-loader!./instruction.html';
import template2 from 'raw-loader!./template-2.html';
import test1 from 'raw-loader!./test-1.html';
import test2 from 'raw-loader!./test-2.html';

const templates: DocumentContents[] = [
  { id: 'test-1', contents: test1, },
  { id: 'test-2', contents: test2, },
  // template-2
  { id: 'dynamic-2/view', contents: template2, },
  // defer
  { id: 'dynamic-2/view', contents: defer, },
  // docs
  { id: 'dynamic-2/view', contents: docs, },
  // instruction
  { id: 'dynamic-2/view', contents: instruction, },
];

@Component({
  selector: 'app-view',
  templateUrl: 'view.component.html',
  styleUrls: ['view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewComponent {

  private count = 2;
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
