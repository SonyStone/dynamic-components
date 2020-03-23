
/**
 * Default OuteltConfig
 */
export interface OuteltConfig {
  /**
   * type of component, get from components map
   */
  type: string;

  /**
   * possoble children
   */
  children?: { [key: string]: OuteltConfig[] };

  /**
   * possoble Cache Id
   */
  cacheId?: string;
}