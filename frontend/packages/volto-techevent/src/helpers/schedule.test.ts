import { describe, it, expect } from 'vitest';
import microphoneSVG from '@plone-collective/volto-techevent/icons/microphone.svg';
import clockSVG from '@plone/volto/icons/clock.svg';
import type { ScheduleSlot } from '../types/schedule';
import {
  buildContinuousGridRows,
  buildTimeline,
  getDayRooms,
  getGridRowsAndColumns,
  getGridTemplate,
  getSlotRoomsClass,
  gridLabels,
  isSessionSlot,
  nextTimeSlot,
} from './schedule';

/** A slot with only the keys the helpers read. */
const slot = (props: Partial<ScheduleSlot>): ScheduleSlot =>
  ({
    '@type': 'Talk',
    start: '2026-10-13T09:00:00-03:00',
    gridRow: '',
    gridColumn: '',
    gridHeight: 0,
    ...props,
  }) as ScheduleSlot;

describe('gridLabels', () => {
  it('splits a range and trims each label', () => {
    expect(gridLabels('time-0900 / time-0930')).toEqual([
      'time-0900',
      'time-0930',
    ]);
  });

  it('keeps a single label', () => {
    expect(gridLabels('room-2')).toEqual(['room-2']);
  });

  it('returns no labels for an empty range', () => {
    expect(gridLabels('')).toEqual([]);
  });
});

describe('nextTimeSlot', () => {
  it('adds 15 minutes', () => {
    expect(nextTimeSlot('0900')).toBe('0915');
  });

  it('carries into the next hour', () => {
    expect(nextTimeSlot('0945')).toBe('1000');
  });

  it('pads the hour', () => {
    expect(nextTimeSlot('0045')).toBe('0100');
  });
});

describe('getGridRowsAndColumns', () => {
  it('collects the row labels in the order the slots use them', () => {
    const { gridRows } = getGridRowsAndColumns([
      slot({ gridRow: 'time-0900 / time-0930' }),
      slot({ gridRow: 'time-0930 / time-1000' }),
    ]);
    expect(gridRows).toEqual(['time-0900', 'time-0930', 'time-1000']);
  });

  it('sorts the room columns by number and drops other labels', () => {
    const { gridColumns } = getGridRowsAndColumns([
      slot({ gridColumn: 'room-10' }),
      slot({ gridColumn: 'room-2' }),
      slot({ gridColumn: 'room-1 / room-all' }),
    ]);
    expect(gridColumns).toEqual(['room-1', 'room-2', 'room-10']);
  });
});

describe('buildContinuousGridRows', () => {
  it('fills every 15 minute row from the first to the last label', () => {
    expect(buildContinuousGridRows(['time-0900', 'time-1000'])).toEqual([
      'time-0900',
      'time-0915',
      'time-0930',
      'time-0945',
      'time-1000',
    ]);
  });

  it('ignores labels that are not times', () => {
    expect(buildContinuousGridRows(['', 'time-0900', 'time-0915'])).toEqual([
      'time-0900',
      'time-0915',
    ]);
  });

  it('returns no rows without labels', () => {
    expect(buildContinuousGridRows([])).toEqual([]);
  });
});

describe('getGridTemplate', () => {
  it('builds the rows and columns of the day grid', () => {
    expect(
      getGridTemplate([
        slot({ gridRow: 'time-0900 / time-0930', gridColumn: 'room-2' }),
        slot({ gridRow: 'time-0900 / time-0930', gridColumn: 'room-1' }),
      ]),
    ).toEqual({
      gridTemplateRows: [
        '[rooms] auto',
        '[time-0900] auto',
        '[time-0915] auto',
        '[time-0930] auto',
      ].join('\n'),
      gridTemplateColumns: '[times] 5rem [room-1] 1fr [room-2] 1fr [room-all]',
    });
  });

  it('keeps the header row and the edge columns for an empty day', () => {
    expect(getGridTemplate([])).toEqual({
      gridTemplateRows: '[rooms] auto',
      gridTemplateColumns: '[times] 5rem [room-all]',
    });
  });
});

describe('getDayRooms', () => {
  it('drops the "every room" entry', () => {
    expect(
      getDayRooms([
        ['_all_', '_all_'],
        ['room-a', 'Room A'],
      ]),
    ).toEqual([['room-a', 'Room A']]);
  });
});

describe('getSlotRoomsClass', () => {
  it('names the single room of a slot', () => {
    expect(getSlotRoomsClass('room-2')).toBe('room-2');
  });

  it('uses room-all for a slot spanning every room', () => {
    expect(getSlotRoomsClass('room-1 / room-all')).toBe('room-all');
  });

  it('lists the rooms of a range', () => {
    expect(getSlotRoomsClass('room-1 / room-3')).toBe('room-1 room-3');
  });
});

describe('isSessionSlot', () => {
  it('treats a plain slot as a slot', () => {
    expect(isSessionSlot(slot({ '@type': 'Slot' }))).toBe(false);
  });

  it('treats a talk as a session', () => {
    expect(isSessionSlot(slot({ '@type': 'Talk' }))).toBe(true);
  });
});

describe('buildTimeline', () => {
  const nine = '2026-10-13T09:00:00-03:00';
  const talkA = slot({ start: nine, gridRow: 'time-0900 / time-0930' });
  const talkB = slot({ start: nine, gridRow: 'time-0900 / time-0930' });
  const lunch = slot({
    '@type': 'Slot',
    slot_category: 'slot',
    start: '2026-10-13T12:00:00-03:00',
    gridRow: 'time-1200 / time-1300',
  });

  it('adds one time entry before the first slot of each start time', () => {
    const timeline = buildTimeline([talkA, talkB, lunch]);
    expect(timeline.map((entry) => entry.kind)).toEqual([
      'time',
      'slot',
      'slot',
      'time',
      'slot',
    ]);
  });

  it('places the time entry on the first row of its slot', () => {
    const [entry] = buildTimeline([talkA]);
    expect(entry).toEqual({
      kind: 'time',
      start: nine,
      gridRow: 'time-0900',
      icon: microphoneSVG,
    });
  });

  it('uses the icon of the first slot of the start time', () => {
    const timeline = buildTimeline([lunch]);
    expect(timeline[0].kind === 'time' && timeline[0].icon).toBe(clockSVG);
  });

  it('keeps an empty row for a slot without dates', () => {
    const [entry] = buildTimeline([slot({ start: null, gridRow: '' })]);
    expect(entry.kind === 'time' && entry.gridRow).toBe('');
  });

  it('returns no entries for a day without slots', () => {
    expect(buildTimeline([])).toEqual([]);
  });
});
