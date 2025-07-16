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
  session_track: Level[];
  text: RichText | null;
  session_language: Term;
}

export interface TrainingInfo extends SessionInfo {
  requirements: RichText | null;
}

export interface SlotItem {
  id: string;
  items: Record<string, BrainSessionInfo[]>;
  types: string[];
}
export interface DaySchedule {
  id: string;
  items: SlotItem[];
  rooms: string[];
}
export interface ScheduleActionResult {
  items: DaySchedule[];
}
