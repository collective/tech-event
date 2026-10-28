import type { Content } from '@plone/types';
import type { Brain, Link, RichText, Term } from './common';
import type { Presenter } from './presenter';
import type { Audience, Duration, Level, Track } from './eventSettings';

export interface BrainSessionInfo extends Brain {
  start: string | null;
  end: string | null;
  room: Link[] | null;
  session_audience: Audience[];
  session_duration: Duration[];
  session_level: Level[];
  session_track: Track[];
  presenters: Presenter[];
}

export interface ScheduleInfo extends Content {
  start: string | null;
  end: string | null;
  room: Term[] | null;
}

export interface SessionInfo extends ScheduleInfo {
  presenters: Presenter[];
  session_audience: Audience[];
  session_duration: Duration[];
  session_level: Level[];
  session_track: Track[];
  text: RichText | null;
  session_language: Term;
  session_video: string | null;
}

export interface TrainingInfo extends SessionInfo {
  requirements: RichText | null;
}

export interface LightningTalk {
  id: string;
  title: string;
  presenters: string;
}

export interface LightningTalksInfo extends ScheduleInfo {
  talks: LightningTalk[];
  session_video: string | null;
}

/**
 * A slot or session in a day of the `@schedule` service, with the CSS grid
 * placement the backend computes for it.
 */
export interface ScheduleSlot extends BrainSessionInfo {
  slot_category?: string | null;
  /** Grid row range, e.g. `time-0900 / time-0930`; empty without dates. */
  gridRow: string;
  /** Grid column range, e.g. `room-2` or `room-1 / room-all`. */
  gridColumn: string;
  /** Duration in 15 minute rows. */
  gridHeight: number;
}

/** A room of the day, as an `[id, label]` pair; `_all_` spans every room. */
export type ScheduleRoom = [id: string, label: string];

export interface DaySchedule {
  id: string;
  items: ScheduleSlot[];
  rooms: ScheduleRoom[];
}
export interface ScheduleActionResult {
  items: DaySchedule[];
}
