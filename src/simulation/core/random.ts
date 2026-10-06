export function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Clamps a value between a minimum and maximum.
 * @param value
 * @param min
 * @param max
 * @returns
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Approaches a target value by a specified amount.
 * @param current  
 * @param target
 * @param amount
 * @returns
 */
export function approach(
  current: number,
  target: number,
  amount: number,
): number {
  if (current < target) {
    return Math.min(current + amount, target);
  }

  return Math.max(current - amount, target);
}
