export type Layouts = Layout[];

export interface Layout {

  /**
   * This should be a dynamic-field type added either by you or a plugin.
   * More information over at Creating Dynamic Fields.
   */
  type?: string;

  /**
   * An array of child `Layout` objects that specifies a nested layout
   * configuration.
   */
  children: Layout[];

  [key: string]: any;
}
