import type { InheritedBehaviorFrom } from './common';

/*
 * The entries of the event settings are keyed by `id`. A session refers to
 * an entry by its `token`, so each entry type also allows a `token`.
 */
export interface Audience {
  id: string;
  token?: string;
  title: string;
  color: string;
}

export interface Duration {
  id: string;
  token?: string;
  title: string;
  duration: number;
  color: string;
}

export interface Level {
  id: string;
  token?: string;
  title: string;
  color: string;
}

export interface Track {
  id: string;
  token?: string;
  title: string;
  color: string;
}

export interface EventSettings {
  audience: Audience[];
  durations_keynote: Duration[];
  durations_talk: Duration[];
  durations_training: Duration[];
  days: string[]; // ISO 8601 date string
  end: string; // ISO 8601 datetime string
  start: string; // ISO 8601 datetime string
  levels: Level[];
  tracks: Track[];
}

export interface EventSettingsBehavior {
  from: InheritedBehaviorFrom;
  data: EventSettings;
}
