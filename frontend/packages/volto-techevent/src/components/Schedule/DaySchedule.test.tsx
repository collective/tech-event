import { describe, it, expect } from 'vitest';
import DaySchedule from './DaySchedule';
import { day, emptyDay, eventStore } from './fixtures';
import { renderInVolto } from '../../testing/render';

describe('DaySchedule', () => {
  it('labels each room column and places the talks in them', () => {
    const { container } = renderInVolto(<DaySchedule day={day} />, eventStore);
    const rooms = Array.from(
      container.querySelectorAll('.room-header .room-label'),
    ).map((el) => el.textContent);
    expect(rooms).toEqual(['Room A', 'Room B']);
    expect(
      container.querySelectorAll('.timeslot-session .sessionTile'),
    ).toHaveLength(1);
    expect(container.querySelector('.sessionTitle .title')?.textContent).toBe(
      'Building with Volto',
    );
  });

  it('renders the headers but no slots for a day without talks', () => {
    const { container } = renderInVolto(
      <DaySchedule day={emptyDay} />,
      eventStore,
    );
    expect(container.querySelectorAll('.timeslot')).toHaveLength(0);
    expect(container.querySelectorAll('.room-header')).toHaveLength(0);
    expect(container.querySelector('.day-header')).not.toBeNull();
  });
});
