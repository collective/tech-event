import type { InheritedBehaviorFrom } from './common';

export interface Audience {
  id: string;
  title: string;
  color: string;
}

export interface Duration {
  id: string;
  title: string;
  duration: number;
  color: string;
}

export interface Level {
  id: string;
  title: string;
  color: string;
}

export interface Track {
  id: string;
  title: string;
  color: string;
}

export interface EventSettings {
  audience: Audience[];
  durations_keynote: Duration[];
  durations_talk: Duration[];
  durations_training: Duration[];
  end: string; // ISO 8601 datetime string
  start: string; // ISO 8601 datetime string
  levels: Level[];
  tracks: Track[];
}

export interface EventSettingsBehavior {
  from: InheritedBehaviorFrom;
  data: EventSettings;
}
