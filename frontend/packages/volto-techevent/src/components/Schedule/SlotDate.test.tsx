import { describe, it, expect } from 'vitest';
import SlotDate from './SlotDate';
import { slotContent } from './fixtures';
import { renderInVolto } from '../../testing/render';

describe('SlotDate', () => {
  it('shows the start and end times of a short format', () => {
    const { container } = renderInVolto(
      <SlotDate
        item={slotContent}
        shortFormat
        locale="pt"
        className="sessionInfoItem"
      />,
    );
    expect(container.querySelector('.slotDate')?.className).toBe(
      'slotDate sessionInfoItem',
    );
    expect(
      container.querySelector('time.start')?.getAttribute('dateTime'),
    ).toBe('2026-10-13T12:00:00-03:00');
    expect(container.querySelector('time.end')?.getAttribute('dateTime')).toBe(
      '2026-10-13T13:00:00-03:00',
    );
    expect(container.querySelector('.date')).toBeNull();
  });

  it('adds the date in the long format', () => {
    const { container } = renderInVolto(
      <SlotDate item={slotContent} shortFormat={false} locale="pt" />,
    );
    expect(container.querySelector('.date')?.textContent).not.toBe('');
    expect(container.querySelectorAll('time')).toHaveLength(2);
  });

  it('renders no times without a start', () => {
    const { container } = renderInVolto(
      <SlotDate
        item={{ ...slotContent, start: null, end: null }}
        shortFormat
        locale="pt"
      />,
    );
    expect(container.querySelector('.wrapper')).toBeNull();
    expect(container.querySelectorAll('time')).toHaveLength(0);
  });
});
