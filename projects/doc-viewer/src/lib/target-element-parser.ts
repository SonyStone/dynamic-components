import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

import { DocumentView } from './document-view';


/**
 * Prepare for setting the window title and ToC.
 * Return a function to actually set them.
 */
export interface TargetElementParser {
  prepare(view: DocumentView): Observable<void>;
  execute(): Observable<void>;
  onError(err: any): void;
  dispose(): void;
}

export const TARGET_ELEMENT_PARSER = new InjectionToken<TargetElementParser>('target-element-parser')
