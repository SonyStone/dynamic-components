/**
 * Used for Object pool pattern.
 */
export interface Resettable {
  /**
   * resets object to default state
   */
  reset(): void;
}
