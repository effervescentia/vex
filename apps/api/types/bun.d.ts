declare module 'bun:test' {
  interface Matchers<T> {
    /**
     * Assert whether a date is before another or not.
     * @param {Date} date - Date to compare to
     * @example
     * expect(new Date(2017, 8)).toBeBefore(new Date(2020, 8))
     */
    toBeBefore(date: Date): void;

    /**
     * Assert whether a date is after another or not.
     * @param {Date} date - Date to compare to
     * @example
     * expect(new Date(2020, 8)).toBeAfter(new Date(2017, 8))
     */
    toBeAfter(date: Date): void;
  }
}
