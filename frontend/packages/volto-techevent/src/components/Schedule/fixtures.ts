/**
 * Fixtures for the schedule stories and tests.
 *
 * Each fixture carries only the keys the components read, so the casts go
 * through `unknown`. Nothing here points at a real deployment.
 */
import type {
  BrainSessionInfo,
  DaySchedule,
  LightningTalksInfo,
  ScheduleInfo,
  SessionInfo,
} from '@plone-collective/volto-techevent/types/schedule';

const EVENT_ROOT = 'https://example.org/event';

/** Event settings as the event root's behavior stores them. */
export const eventSettings = {
  audience: [{ id: 'developers', title: 'Developers', color: '#ff0000' }],
  durations_keynote: [],
  durations_talk: [],
  durations_training: [],
  days: ['2026-10-13', '2026-10-14'],
  end: '2026-10-14T18:00:00-03:00',
  start: '2026-10-13T09:00:00-03:00',
  levels: [{ id: 'beginner', title: 'Beginner', color: '#00ff00' }],
  tracks: [{ id: 'web', title: 'Web', color: '#0000ff' }],
};

/** A Redux state slice that makes the event settings visible to the hooks. */
export const eventStore = {
  content: {
    data: {
      '@components': {
        inherit: {
          'collective.techevent.event_settings': {
            from: { '@id': EVENT_ROOT },
            data: eventSettings,
          },
        },
      },
    },
  },
};

export const presenterAda = {
  '@id': `${EVENT_ROOT}/presenters/ada`,
  '@type': 'Presenter',
  UID: 'presenter-ada',
  title: 'Ada Lovelace',
  description: 'Analytical engine',
  review_state: 'published',
  social_links: null,
  activities: [],
  image_scales: null,
};

export const presenterGrace = {
  ...presenterAda,
  '@id': `${EVENT_ROOT}/presenters/grace`,
  UID: 'presenter-grace',
  title: 'Grace Hopper',
};

export const presenterKatherine = {
  ...presenterAda,
  '@id': `${EVENT_ROOT}/presenters/katherine`,
  UID: 'presenter-katherine',
  title: 'Katherine Johnson',
};

/** A session as the schedule brain returns it. */
export const brainSession = {
  '@id': `${EVENT_ROOT}/day-1/building-with-volto`,
  '@type': 'Talk',
  UID: 'session-volto',
  title: 'Building with Volto',
  description: 'Blocks, from zero to published.',
  review_state: 'published',
  start: '2026-10-13T09:00:00-03:00',
  end: '2026-10-13T09:30:00-03:00',
  room: [{ '@id': `${EVENT_ROOT}/rooms/a`, title: 'Room A' }],
  presenters: [presenterAda],
  session_audience: [{ token: 'developers', title: 'Developers' }],
  session_duration: [],
  session_level: [{ token: 'beginner', title: 'Beginner' }],
  session_track: [{ token: 'web', title: 'Web' }],
} as unknown as BrainSessionInfo;

/** A session as its own view receives it. */
export const sessionContent = {
  '@id': brainSession['@id'],
  '@type': 'Talk',
  UID: brainSession.UID,
  title: brainSession.title,
  description: brainSession.description,
  review_state: 'published',
  start: brainSession.start,
  end: brainSession.end,
  room: brainSession.room,
  presenters: [],
  session_audience: brainSession.session_audience,
  session_duration: [],
  session_level: brainSession.session_level,
  session_track: brainSession.session_track,
  session_language: { token: 'en', title: 'English' },
  session_video: null,
  text: null,
  items: [],
} as unknown as SessionInfo;

/** A slot as its own view receives it. */
export const slotContent = {
  '@id': `${EVENT_ROOT}/day-1/lunch`,
  '@type': 'Slot',
  UID: 'slot-lunch',
  title: 'Lunch',
  description: 'Bring your own plate.',
  review_state: 'published',
  start: '2026-10-13T12:00:00-03:00',
  end: '2026-10-13T13:00:00-03:00',
  room: null,
} as unknown as ScheduleInfo;

/** A slot as the schedule brain returns it, for the tile. */
export const slotBrain = slotContent as unknown as BrainSessionInfo;

/** The brain session with the given presenters. */
export const brainWithPresenters = (presenters: unknown[]) =>
  ({ ...brainSession, presenters }) as unknown as BrainSessionInfo;

/** A lightning talks block with two talks. */
export const lightningTalksContent = {
  '@id': `${EVENT_ROOT}/day-1/lightning`,
  '@type': 'LightningTalks',
  UID: 'lightning-1',
  title: 'Lightning talks',
  description: 'Five minutes each.',
  review_state: 'published',
  start: '2026-10-13T17:00:00-03:00',
  end: '2026-10-13T17:30:00-03:00',
  room: null,
  talks: [
    { id: 'talk-1', title: 'Fast forms', presenters: 'Ada Lovelace' },
    { id: 'talk-2', title: 'Fast search', presenters: 'Grace Hopper' },
  ],
  session_video: null,
  items: [],
} as unknown as LightningTalksInfo;

/** One day of the schedule: two rooms, one talk in the first room. */
export const day: DaySchedule = {
  id: '2026-10-13',
  // Rooms are [id, label] pairs; the type in `types/schedule` says string.
  rooms: [
    ['room-a', 'Room A'],
    ['room-b', 'Room B'],
  ] as unknown as string[],
  items: [
    {
      ...brainSession,
      '@type': 'Talk',
      gridRow: 'time-0900',
      gridColumn: 'room-1',
      gridHeight: 2,
    },
  ] as unknown as DaySchedule['items'],
};

/**
 * Props for a component under test. A test sets only the keys the component
 * reads, so the rest of the full props type is left out here.
 */
export const asProps = <P>(props: Partial<P>): P => props as P;

/** A day with no slots, for the empty branch. */
export const emptyDay: DaySchedule = {
  id: '2026-10-14',
  rooms: [] as unknown as string[],
  items: [],
};
