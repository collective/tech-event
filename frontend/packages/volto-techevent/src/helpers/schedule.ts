import { getSlotIcon } from '@plone-collective/volto-techevent/helpers/icons';
import type {
  ScheduleRoom,
  ScheduleSlot,
} from '@plone-collective/volto-techevent/types/schedule';

/** Room id the backend uses for slots without a room. */
export const ALL_ROOMS = '_all_';

/** A row header of the schedule grid: the start time of its slots. */
export interface TimeEntry {
  kind: 'time';
  start: string | null;
  gridRow: string;
  icon: string;
}

/** A cell of the schedule grid holding one slot. */
export interface SlotEntry {
  kind: 'slot';
  slot: ScheduleSlot;
}

export type TimelineEntry = TimeEntry | SlotEntry;

export interface GridTemplate {
  gridTemplateRows: string;
  gridTemplateColumns: string;
}

/** The labels of a grid range such as `room-1 / room-all`. */
export function gridLabels(range: string): string[] {
  return range
    .split('/')
    .map((label) => label.trim())
    .filter(Boolean);
}

/** The time `HHMM` one 15 minute row after `time`. */
export function nextTimeSlot(time: string): string {
  let hours = parseInt(time.slice(0, 2), 10);
  let minutes = parseInt(time.slice(2, 4), 10) + 15;
  if (minutes >= 60) {
    hours += 1;
    minutes -= 60;
  }
  return (
    hours.toString().padStart(2, '0') + minutes.toString().padStart(2, '0')
  );
}

/**
 * The grid row labels and the room column labels used by the slots.
 *
 * Rows keep the order in which the slots use them; columns are sorted by
 * room number, and only `room-N` labels are kept.
 */
export function getGridRowsAndColumns(slots: ScheduleSlot[]): {
  gridRows: string[];
  gridColumns: string[];
} {
  const gridRows = new Set<string>();
  const gridColumns = new Set<string>();
  slots.forEach(({ gridRow = '', gridColumn = '' }) => {
    gridLabels(gridRow).forEach((label) => gridRows.add(label));
    gridLabels(gridColumn).forEach((label) => gridColumns.add(label));
  });
  const roomNumber = (label: string) => parseInt(label.split('-')[1], 10);
  return {
    gridRows: Array.from(gridRows),
    gridColumns: Array.from(gridColumns)
      .filter((label) => /^room-\d+$/.test(label))
      .sort((a, b) => roomNumber(a) - roomNumber(b)),
  };
}

/**
 * Every 15 minute row label from the earliest to the latest of `gridRows`, so
 * the grid has no gaps. Labels that are not `time-HHMM` are ignored.
 */
export function buildContinuousGridRows(gridRows: string[]): string[] {
  // The labels come in slot order, so a long slot can end after the last one.
  const times = gridRows
    .map((label) => label.match(/time-(\d{4})/)?.[1])
    .filter((time): time is string => Boolean(time))
    .sort();
  if (times.length === 0) {
    return [];
  }
  const end = times[times.length - 1];
  const rows: string[] = [];
  for (let time = times[0]; time <= end; time = nextTimeSlot(time)) {
    rows.push(`time-${time}`);
  }
  return rows;
}

/** The CSS grid template of a day: a header row, then one row per 15 min. */
export function getGridTemplate(slots: ScheduleSlot[]): GridTemplate {
  const { gridRows, gridColumns } = getGridRowsAndColumns(slots);
  const rows = buildContinuousGridRows(gridRows);
  return {
    gridTemplateRows: [
      '[rooms] auto',
      ...rows.map((row) => `[${row}] auto`),
    ].join('\n'),
    gridTemplateColumns: [
      '[times] 5rem',
      ...gridColumns.map((column) => `[${column}] 1fr`),
      '[room-all]',
    ].join(' '),
  };
}

/** The rooms that get a column header: all but the "every room" entry. */
export function getDayRooms(rooms: ScheduleRoom[]): ScheduleRoom[] {
  return rooms.filter(([id]) => id !== ALL_ROOMS);
}

/** CSS class naming the rooms a slot spans. */
export function getSlotRoomsClass(gridColumn: string): string {
  return gridColumn.includes('room-all')
    ? 'room-all'
    : gridLabels(gridColumn).join(' ');
}

/** Whether the slot is shown as a session rather than a plain slot. */
export function isSessionSlot(slot: ScheduleSlot): boolean {
  return slot['@type'] !== 'Slot';
}

/**
 * The cells of a day in order: before the first slot of each start time, a
 * time entry for its row header.
 */
export function buildTimeline(slots: ScheduleSlot[]): TimelineEntry[] {
  const seen = new Set<string | null>();
  return slots.flatMap((slot): TimelineEntry[] => {
    const entry: SlotEntry = { kind: 'slot', slot };
    if (seen.has(slot.start)) {
      return [entry];
    }
    seen.add(slot.start);
    const time: TimeEntry = {
      kind: 'time',
      start: slot.start,
      gridRow: gridLabels(slot.gridRow)[0] ?? '',
      icon: getSlotIcon(slot),
    };
    return [time, entry];
  });
}
