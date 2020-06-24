/*
 * Public API Surface of doc-viewer
 */

export { DocumentContents, DOCUMENT_ID } from './lib/document-contents.interface';
export { TARGET_ELEMENT_PARSER, TargetElementParser } from './lib/target-element-parser';
export { DocumentView } from './lib/document-view';
export { CONSOLE } from './lib/console.injection-token';

export { DocViewerModule } from './lib/doc-viewer.module';
export { DocViewerDirective } from './lib/doc-viewer.directive';

// utils
export { raf } from './lib/utils/request-animation-frame-operator';
export { VOID } from './lib/utils/void';

