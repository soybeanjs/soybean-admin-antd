/**
 * the common type namespace
 */
declare namespace Common {
  /**
   * the strategy action type
   * - 0: the condition
   * - 1: the action function, which will be called when the condition is true
   */
  type StrategyAction = [boolean, () => void];

  /**
   * the option type
   * @property value: the option value
   * @property label: the option label
   */
  type Option<K> = { value: K; label: string };
}
