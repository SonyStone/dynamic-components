import { Component, DebugElement, Input, NgModule, Type, ViewEncapsulation } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DynamicModule } from './dynamic.module';
import { expect, elementText } from './testing/matchers';

describe('Dynamic', () => {

  describe('dynamic', () => {
    describe('should initialize', () => {
      let fixture: ComponentFixture<RootComponent>;
      let component: RootComponent;
      let rootElement: HTMLElement;

      const detectChangesAndExpectText = (text: string): void => {
        fixture.detectChanges();
        expect(fixture.nativeElement).toHaveText(text);
      }

      const getDebugElement = (type: Type<any>): DebugElement => {
        return fixture.debugElement.query(By.directive(type));

      }

      const getElement = (type: Type<any>): HTMLElement => {
        return getDebugElement(type).nativeElement;
      }

      beforeEach(() => {
        configureDynamicTestingModule([RootComponent]);
        fixture = TestBed.createComponent(RootComponent);

        component = fixture.componentInstance;
        rootElement = fixture.nativeElement;

        fixture.detectChanges();
      });

      afterEach(() => {
        fixture = null;
        component = null;
        rootElement = null;
      });

      it('with rendered', () => {

        const config = [
          { type: 'test-green'},
          { type: 'test-red'},
          { type: 'test-red'},
        ];

        component.config = config

        fixture.detectChanges();

        const rootChildren = Array.from(rootElement.children);
        const greenElement = getElement(TestGreenComponent);
        const redElement = getElement(TestRedComponent);

        expect(rootChildren).toEqual([greenElement, redElement, redElement]);
      });

      it('with children', () => {
        component.config = [
          {
            id: 'green',
            type: 'test-green',
            children: {
              def: [
                {
                  id: 'red',
                  type: 'test-red'
                },
              ]
            }
          },
        ];

        fixture.detectChanges();

        const rootChildren = Array.from(rootElement.children);

        const greenElement = getElement(TestGreenComponent);
        const greenChildren = Array.from(greenElement.children);

        const redElement = getElement(TestRedComponent);
        const redChildren = Array.from(redElement.children);

        expect(rootChildren).toEqual([greenElement]);
        expect(greenChildren).toEqual([redElement]);
        expect(redChildren).toEqual([]);
      });

      it('should move array elements, not recreate them', () => {

        component.config = [
          {
            id: 'green',
            type: 'test-green',
          },
          {
            id: 'red',
            type: 'test-red'
          },
        ];

        fixture.detectChanges();

        const before = {
          rootChildren: Array.from(rootElement.children),
          green: getElement(TestGreenComponent),
          red: getElement(TestRedComponent),
        }

        expect(before.rootChildren).toEqual([before.green, before.red]);

        component.config = [
          {
            id: 'red',
            type: 'test-red'
          },
          {
            id: 'green',
            type: 'test-green',
          },
        ];

        fixture.detectChanges();

        const after = {
          rootChildren: Array.from(rootElement.children),
          green: getElement(TestGreenComponent),
          red: getElement(TestRedComponent),
        }

        expect(after.rootChildren).toEqual([after.red, after.green]);

        expect(before.green).toEqual(after.green);
        expect(before.red).toEqual(after.red);
      });

      it('should move nested elements, not recreate them', () => {

        component.config = [
          {
            id: 'green',
            type: 'test-green'
          },
          {
            id: 'red',
            type: 'test-red'
          },
        ];

        fixture.detectChanges();

        const before = {
          rootChildren: Array.from(rootElement.children),
          green: getElement(TestGreenComponent),
          red: getElement(TestRedComponent),
        }

        expect(before.rootChildren).toEqual([before.green, before.red]);

        component.config = [
          {
            // id: 'green',
            type: 'test-green',
            children: {
              def: [
                {
                  // id: 'red',
                  type: 'test-red',
                },
              ]
            }
          },
        ];

        fixture.detectChanges();

        const after = {
          rootChildren: Array.from(rootElement.children),
          green: getElement(TestGreenComponent),
          greenChildren: Array.from(getElement(TestGreenComponent).children),
          red: getElement(TestRedComponent),
        }

        expect(after.rootChildren).toEqual([after.green]);
        expect(after.greenChildren).toEqual([after.red]);

        expect(before.green).toEqual(after.green);
        expect(before.red).toEqual(after.red);
      });
    })
  })
})



const configureDynamicTestingModule = (declarations: Type<any>[] = []) => {
  TestBed.configureTestingModule({
    imports: [
      [
        DynamicModule,
      ],
      [
        TestModule,
      ],
    ],
    declarations,
  }).compileComponents();
}

@Component({
  selector: 'app-root',
  template: `
    <ng-container *dynamic-outlet="config"></ng-container>
  `,
})
export class RootComponent {
  @Input() config: any;
}

@Component({
  selector: 'app-test-green',
  template: `
    <ng-container dynamic-children-outlet="def"></ng-container>
  `,
  styles: [`
      :host {
        background-color: green;
        display: block;
        margin: 1rem;
        padding: 1rem;
      }
  `],
  encapsulation: ViewEncapsulation.None,
})
export class TestGreenComponent {
  seed = Math.random();
}

@Component({
  selector: 'app-test-red',
  template: `
    <ng-container dynamic-children-outlet="def"></ng-container>
  `,
  styles: [`
    :host {
      background-color: red;
      display: block;
      margin: 1rem;
      padding: 1rem;
    }
  `],
  encapsulation: ViewEncapsulation.None,
})
export class TestRedComponent {
  seed = Math.random();
}


@NgModule({
  imports: [
    DynamicModule.forChild({
      types: [{
        name: 'test-green',
        component: TestGreenComponent,
      },
      {
        name: 'test-red',
        component: TestRedComponent,
      }]
    }),
  ],
  declarations: [
    TestGreenComponent,
    TestRedComponent,
  ],
  exports: [
    TestGreenComponent,
    TestRedComponent,
  ],
})
export class TestModule { }
