import { describe, it, expect } from 'vitest';
import { formatHour } from './date';

describe('formatHour', () => {
  it('formats the hour and minutes with two digits each', () => {
    expect(formatHour(new Date(2026, 9, 13, 9, 5))).toBe('09:05');
  });

  it('uses the 24 hour clock', () => {
    expect(formatHour(new Date(2026, 9, 13, 14, 30))).toBe('14:30');
  });

  it('keeps midnight as 00:00', () => {
    expect(formatHour(new Date(2026, 9, 13, 0, 0))).toBe('00:00');
  });
});
