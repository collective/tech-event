/**
 * Registration actions
 * @module actions/registration/registration
 */
import { flattenToAppURL } from '@plone/volto/helpers/Url/Url';
import {
  CANCEL_REGISTRATION,
  GET_REGISTRATION,
  LIST_ATTENDEES,
  POST_REGISTRATION,
  VERIFY_REGISTRATION,
} from '@plone-collective/volto-techevent/constants/ActionTypes';
import type { RegistrationData } from '@plone-collective/volto-techevent/types/registration';

export interface GetRegistrationAction {
  type: typeof GET_REGISTRATION;
  request: { op: 'get'; path: string };
}

export interface PostRegistrationAction {
  type: typeof POST_REGISTRATION;
  request: { op: 'post'; path: string; data: Partial<RegistrationData> };
}

export interface CancelRegistrationAction {
  type: typeof CANCEL_REGISTRATION;
  request: { op: 'post'; path: string; data: Record<string, never> };
}

export interface VerifyRegistrationAction {
  type: typeof VERIFY_REGISTRATION;
  request: { op: 'post'; path: string; data: { token: string } };
}

export interface ListAttendeesAction {
  type: typeof LIST_ATTENDEES;
  request: { op: 'get'; path: string };
}

/**
 * Get the registration status of an event, and the user's registration.
 * @param eventRoot - Path to the event root object.
 */
export function getRegistration(eventRoot: string): GetRegistrationAction {
  return {
    type: GET_REGISTRATION,
    request: {
      op: 'get',
      path: `${flattenToAppURL(eventRoot)}/@registration`,
    },
  };
}

/**
 * Register for an event.
 * @param eventRoot - Path to the event root object.
 * @param data - First name, last name and email; a logged-in user may
 *   leave them out to use the account's.
 */
export function postRegistration(
  eventRoot: string,
  data: Partial<RegistrationData>,
): PostRegistrationAction {
  return {
    type: POST_REGISTRATION,
    request: {
      op: 'post',
      path: `${flattenToAppURL(eventRoot)}/@registration`,
      data,
    },
  };
}

/**
 * Cancel the registration of the current user.
 * @param eventRoot - Path to the event root object.
 */
export function cancelRegistration(
  eventRoot: string,
): CancelRegistrationAction {
  return {
    type: CANCEL_REGISTRATION,
    request: {
      op: 'post',
      path: `${flattenToAppURL(eventRoot)}/@registration/cancel`,
      data: {},
    },
  };
}

/**
 * Verify the email address of a registration, with the emailed token.
 * @param eventRoot - Path to the event root object.
 * @param token - The token from the link.
 */
export function verifyRegistration(
  eventRoot: string,
  token: string,
): VerifyRegistrationAction {
  return {
    type: VERIFY_REGISTRATION,
    request: {
      op: 'post',
      path: `${flattenToAppURL(eventRoot)}/@registration/verify`,
      data: { token },
    },
  };
}

/**
 * List the registrations of an Attendees container.
 * @param path - Path to the Attendees container.
 * @param reviewState - Only list registrations in this state.
 */
export function listAttendees(
  path: string,
  reviewState?: string,
): ListAttendeesAction {
  const query = reviewState
    ? `?review_state=${encodeURIComponent(reviewState)}`
    : '';
  return {
    type: LIST_ATTENDEES,
    request: {
      op: 'get',
      path: `${flattenToAppURL(path)}/@attendees${query}`,
    },
  };
}
