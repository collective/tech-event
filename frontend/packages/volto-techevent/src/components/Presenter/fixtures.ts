/**
 * Fixtures for the presenter stories and tests.
 *
 * Each fixture carries only the keys the components read, so the casts go
 * through `unknown`.
 */
import type { BrainSessionInfo } from '@plone-collective/volto-techevent/types/schedule';
import type { PresenterActivityGroup } from './PresenterActivities';
import type { PresenterItem } from './types';

const EVENT_ROOT = 'http://example.org/event';

export const presenterAda = {
  '@id': `${EVENT_ROOT}/presenters/ada`,
  '@type': 'Presenter',
  UID: 'presenter-ada',
  title: 'Ada Lovelace',
  description: 'Analytical engine\nFirst programmer',
  review_state: 'published',
  social_links: null,
  activities: [],
  image_scales: null,
  text: { data: '<p>She wrote the first program.</p>' },
  categories: [
    { token: 'speaker', title: 'Speaker' },
    { token: 'pf-member', title: 'Plone Foundation Member' },
  ],
} as unknown as PresenterItem;

export const sessionTalk = {
  '@id': `${EVENT_ROOT}/day-1/building-with-volto`,
  '@type': 'Talk',
  UID: 'session-volto',
  title: 'Building with Volto',
  description: 'Blocks, from zero to published.',
  review_state: 'published',
  start: '2026-10-13T09:00:00-03:00',
  end: '2026-10-13T09:30:00-03:00',
  room: [{ '@id': `${EVENT_ROOT}/rooms/a`, title: 'Room A' }],
  presenters: [],
  session_audience: [],
  session_duration: [],
  session_level: [],
  session_track: [],
} as unknown as BrainSessionInfo;

export const activityGroups: PresenterActivityGroup[] = [
  {
    '@id': `${EVENT_ROOT}/presenters/ada/talks`,
    title: 'Talks',
    items: [sessionTalk],
  },
  {
    '@id': `${EVENT_ROOT}/presenters/ada/workshops`,
    title: 'Workshops',
    items: [],
  },
];
