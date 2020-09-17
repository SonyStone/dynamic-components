import { ComponentPortal } from './component';
import { CustomElement } from './custom-element';
import { TemplatePortal } from './template';

export type TypeHolder = ComponentPortal<any> | TemplatePortal<any> | CustomElement<any>;
