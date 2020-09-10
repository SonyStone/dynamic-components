import { Injectable, TemplateRef, Type } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TemplatesService {

  templates = new Map<Type<any>, TemplateRef<any>[]>();

  set(type: Type<any>, template: TemplateRef<any>): void {
    const templates = this.templates.get(type);

    if (templates) {
      templates.push(template);
    } else {
      this.templates.set(type, [template]);
    }
  }
}
