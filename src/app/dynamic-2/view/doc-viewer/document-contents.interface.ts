export interface DocumentContents {
  /** The unique identifier for this document */
  id: string | DOCUMENT_ID;
  /** The HTML to display in the doc viewer */
  contents: string|null;
}

export enum DOCUMENT_ID {
  FILE_NOT_FOUND = 'file-not-found',
  FETCHING_ERROR = 'fetching-error',
}
