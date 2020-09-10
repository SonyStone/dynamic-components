import { ChangeDetectionStrategy, Component, ContentChild, TemplateRef } from '@angular/core';

@Component({
  selector: 'button[dropdown]',
  templateUrl: 'dropdown.component.html',
  styleUrls: ['dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DropdownComponent {
  @ContentChild(TemplateRef, { static: true }) templateRef: TemplateRef<any>;
}
