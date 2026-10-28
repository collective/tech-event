import { describe, it, expect } from 'vitest';
import ScheduleTimeslot from './ScheduleTimeslot';
import { eventStore, scheduleSlot, scheduleTalk } from './fixtures';
import { renderInVolto } from '../../testing/render';

describe('ScheduleTimeslot', () => {
  it('shows a session in its room', () => {
    const { container } = renderInVolto(
      <ScheduleTimeslot slot={scheduleTalk} />,
      eventStore,
    );
    const cell = container.querySelector<HTMLElement>('.timeslot');
    expect(cell?.className).toBe('timeslot room-1 rows-2');
    expect(cell?.style.gridColumn).toBe('room-1');
    expect(
      container.querySelector('.timeslot-session .sessionTile'),
    ).not.toBeNull();
  });

  it('shows a plain slot across every room', () => {
    const { container } = renderInVolto(
      <ScheduleTimeslot slot={scheduleSlot} />,
      eventStore,
    );
    expect(container.querySelector('.timeslot')?.className).toBe(
      'timeslot room-all rows-4',
    );
    expect(container.querySelector('.timeslot-slot .slotTile')).not.toBeNull();
    expect(container.querySelector('.slotTitle')?.textContent).toBe('Lunch');
  });
});
