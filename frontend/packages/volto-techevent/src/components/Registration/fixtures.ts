/**
 * Payloads of `@registration` and `@attendees`, and stores built from them,
 * for the tests and stories of the registration components.
 */
import type {
  AttendeesListing,
  Registration,
  RegistrationStatus,
} from '@plone-collective/volto-techevent/types/registration';
import { initialState as registrationInitial } from '@plone-collective/volto-techevent/reducers/registration/registration';

export const eventRoot = 'http://localhost:3000/event';

const settingsComponent = {
  inherit: {
    'collective.techevent.event_settings': {
      from: { '@id': eventRoot, title: 'Event' },
      data: {},
    },
  },
};

export const openStatus: RegistrationStatus = {
  '@id': `${eventRoot}/@registration`,
  state: 'open',
  open: true,
  closes_at: '2030-11-20T21:00:00+00:00',
  expired: false,
  allow_anonymous_registration: true,
  registration_confirmation: 'automatic',
  registration: null,
};

export const memberStatus: RegistrationStatus = {
  ...openStatus,
  allow_anonymous_registration: false,
  defaults: {
    first_name: 'Ada',
    last_name: 'Lovelace',
    email: 'ada@example.org',
  },
};

export const registration: Registration = {
  code: 'PYC26-7KQ3M9XD',
  state: 'registered',
  first_name: 'Ada',
  last_name: 'Lovelace',
  email: 'ada@example.org',
  email_verified: true,
};

export const pendingRegistration: Registration = {
  ...registration,
  code: 'PYC26-H2T4W8QA',
  state: 'pending',
  first_name: 'Grace',
  last_name: 'Hopper',
  email: 'grace@example.org',
  email_verified: false,
};

export const registeredStatus: RegistrationStatus = {
  ...memberStatus,
  defaults: undefined,
  registration,
};

export const closedStatus: RegistrationStatus = {
  ...openStatus,
  state: 'closed',
  open: false,
};

export const expiredStatus: RegistrationStatus = {
  ...openStatus,
  open: false,
  expired: true,
  closes_at: '2026-01-10T21:00:00+00:00',
};

export const attendeesListing: AttendeesListing = {
  '@id': `${eventRoot}/attendees/@attendees`,
  state: 'open',
  open: true,
  closes_at: null,
  expired: false,
  allow_anonymous_registration: true,
  registration_confirmation: 'manual',
  items: [
    {
      ...registration,
      '@id': `${eventRoot}/attendees/${registration.code}`,
      title: 'Ada Lovelace',
      UID: 'uid-ada',
    },
    {
      ...pendingRegistration,
      '@id': `${eventRoot}/attendees/${pendingRegistration.code}`,
      title: 'Grace Hopper',
      UID: 'uid-grace',
    },
  ],
  items_total: 2,
  counts: { pending: 1, registered: 1, attended: 0, cancelled: 0 },
  can_review: true,
};

/**
 * A store with the event settings and a registration status.
 * @param status - The `@registration` answer; `null` for an event without
 *   registration.
 * @param loggedIn - Whether a user is logged in.
 */
export function registrationStore(
  status: RegistrationStatus | null,
  loggedIn = false,
): Record<string, unknown> {
  return {
    content: { data: { '@components': settingsComponent } },
    registration: { ...registrationInitial, status },
    userSession: { token: loggedIn ? 'token' : null },
  };
}

/** A store with the registrations of an event, for its organizers. */
export function attendeesStore(
  data: AttendeesListing | null = attendeesListing,
): Record<string, unknown> {
  return {
    attendees: { data, loading: false, error: null, errorStatus: null },
  };
}
