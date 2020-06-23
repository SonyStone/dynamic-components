import { ChangeDetectionStrategy, Component, NgModule, OnDestroy, Renderer2 } from '@angular/core';

import style2 from '!!raw-loader!./instruction-style.css';

@Component({
  selector: 'instruction-style',
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstructionStyleComponent implements OnDestroy {
  private stylesMap: Map<any, Node> = new Map();
  private host: Node;

  constructor(
    private renderer: Renderer2,
  ) {
    this.host = document.head;

    // console.log(style);
    this.addStyle('instruction', style2);
  }

  ngOnDestroy(): void {
    this.removeStyle('instruction')
  }

  private createStyleNode(content: string): Node {

    const styleEl = this.renderer.createElement('style') as HTMLStyleElement;

    const text = this.renderer.createText(content);

    this.renderer.appendChild(styleEl, text);
    return styleEl;
  }

  addStyle(key: any, style: string): void {
    const styleEl = this.createStyleNode(style);
    this.stylesMap.set(key, styleEl);
    this.host.appendChild(styleEl);
  }

  removeStyle(key: any): void {
    const styleEl = this.stylesMap.get(key);
    if (styleEl) {
      this.stylesMap.delete(key);
      this.host.removeChild(styleEl);
    }
  }
}

@NgModule({
  declarations: [InstructionStyleComponent],
  exports: [InstructionStyleComponent],
})
export class InstructionStyleModule { }
