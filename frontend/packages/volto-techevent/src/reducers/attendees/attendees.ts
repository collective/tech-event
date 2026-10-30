/**
 * Attendees reducer: the registrations of an event, for its organizers.
 * @module reducers/attendees/attendees
 */

import { LIST_ATTENDEES } from '@plone-collective/volto-techevent/constants/ActionTypes';
import { errorMessage } from '@plone-collective/volto-techevent/reducers/registration/registration';
import type { AttendeesListing } from '@plone-collective/volto-techevent/types/registration';

export interface AttendeesReducerState {
  data: AttendeesListing | null;
  loading: boolean;
  error: string | null;
  /** The HTTP status of the error, such as `404` outside an Attendees container. */
  errorStatus: number | null;
}

interface AttendeesAction {
  type: string;
  result?: AttendeesListing;
  error?: Parameters<typeof errorMessage>[0];
}

export const initialState: AttendeesReducerState = {
  data: null,
  loading: false,
  error: null,
  errorStatus: null,
};

export default function attendees(
  state: AttendeesReducerState = initialState,
  action: AttendeesAction,
): AttendeesReducerState {
  switch (action.type) {
    case `${LIST_ATTENDEES}_PENDING`:
      // Keep the current list while the next one loads, so the table does
      // not flicker after each check-in
      return { ...state, loading: true, error: null, errorStatus: null };
    case `${LIST_ATTENDEES}_SUCCESS`:
      return {
        data: action.result ?? null,
        loading: false,
        error: null,
        errorStatus: null,
      };
    case `${LIST_ATTENDEES}_FAIL`:
      // The list of another container must not show under this error
      return {
        data: null,
        loading: false,
        error: errorMessage(action.error),
        errorStatus: action.error?.status ?? null,
      };
    default:
      return state;
  }
}
