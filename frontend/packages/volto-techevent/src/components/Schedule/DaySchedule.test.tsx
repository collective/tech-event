import { describe, it, expect } from 'vitest';
import DaySchedule from './DaySchedule';
import { day, emptyDay, eventStore, fullDay } from './fixtures';
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

  it('lays out the grid from the slots of the day', () => {
    const { container } = renderInVolto(
      <DaySchedule day={fullDay} />,
      eventStore,
    );
    const grid = container.querySelector<HTMLElement>('.tab-content');
    expect(grid?.className).toBe('tab-content 2026-10-13 rooms rooms-2');
    expect(grid?.style.gridTemplateColumns).toBe(
      '[times] 5rem [room-1] 1fr [room-all]',
    );
    expect(grid?.style.gridTemplateRows.split('\n')[0]).toBe('[rooms] auto');
  });

  it('skips the "every room" entry and labels rooms without a label', () => {
    const { container } = renderInVolto(
      <DaySchedule day={fullDay} />,
      eventStore,
    );
    const rooms = Array.from(
      container.querySelectorAll('.room-header .room-label'),
    ).map((el) => el.textContent);
    expect(rooms).toEqual(['Room A', 'room-b']);
  });

  it('adds a row header for each start time', () => {
    const { container } = renderInVolto(
      <DaySchedule day={fullDay} />,
      eventStore,
    );
    const rows = Array.from(
      container.querySelectorAll<HTMLElement>('.row-header'),
    ).map((el) => el.style.gridRow);
    expect(rows).toEqual(['time-0900', 'time-1200']);
    expect(container.querySelectorAll('.timeslot')).toHaveLength(2);
    expect(container.querySelector('.timeslot-slot .slotTile')).not.toBeNull();
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
