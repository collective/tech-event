/**
 * Registration reducer: the registration status of an event, the current
 * user's registration, and the email verification.
 * @module reducers/registration/registration
 */

import {
  CANCEL_REGISTRATION,
  GET_REGISTRATION,
  POST_REGISTRATION,
  VERIFY_REGISTRATION,
} from '@plone-collective/volto-techevent/constants/ActionTypes';
import type {
  Registration,
  RegistrationStatus,
} from '@plone-collective/volto-techevent/types/registration';

export interface RegistrationReducerState {
  status: RegistrationStatus | null;
  loading: boolean;
  error: string | null;
  submitting: boolean;
  submitError: string | null;
  verify: {
    loading: boolean;
    result: Registration | null;
    error: string | null;
  };
}

interface ErrorShape {
  status?: number;
  body?: { error?: { message?: string } };
  response?: { body?: { error?: { message?: string } } };
  message?: string;
}

interface RegistrationAction {
  type: string;
  result?: RegistrationStatus | Registration;
  error?: ErrorShape;
}

/**
 * Return the message of a failed request.
 * @param error - The error the API middleware dispatched.
 */
export function errorMessage(error: ErrorShape | undefined): string {
  return (
    error?.response?.body?.error?.message ??
    error?.body?.error?.message ??
    error?.message ??
    'Unknown error'
  );
}

export const initialState: RegistrationReducerState = {
  status: null,
  loading: false,
  error: null,
  submitting: false,
  submitError: null,
  verify: { loading: false, result: null, error: null },
};

export default function registration(
  state: RegistrationReducerState = initialState,
  action: RegistrationAction,
): RegistrationReducerState {
  switch (action.type) {
    case `${GET_REGISTRATION}_PENDING`:
      return { ...state, loading: true, error: null };
    case `${GET_REGISTRATION}_SUCCESS`:
      return {
        ...state,
        loading: false,
        status: (action.result as RegistrationStatus) ?? null,
        error: null,
      };
    case `${GET_REGISTRATION}_FAIL`:
      return {
        ...state,
        loading: false,
        status: null,
        // No Attendees container: the event does not take registrations
        error: action.error?.status === 404 ? null : errorMessage(action.error),
      };
    case `${POST_REGISTRATION}_PENDING`:
    case `${CANCEL_REGISTRATION}_PENDING`:
      return { ...state, submitting: true, submitError: null };
    case `${POST_REGISTRATION}_SUCCESS`:
    case `${CANCEL_REGISTRATION}_SUCCESS`:
      return {
        ...state,
        submitting: false,
        submitError: null,
        status: state.status
          ? {
              ...state.status,
              registration: (action.result as Registration) ?? null,
            }
          : state.status,
      };
    case `${POST_REGISTRATION}_FAIL`:
    case `${CANCEL_REGISTRATION}_FAIL`:
      return {
        ...state,
        submitting: false,
        submitError: errorMessage(action.error),
      };
    case `${VERIFY_REGISTRATION}_PENDING`:
      return { ...state, verify: { loading: true, result: null, error: null } };
    case `${VERIFY_REGISTRATION}_SUCCESS`:
      return {
        ...state,
        verify: {
          loading: false,
          result: (action.result as Registration) ?? null,
          error: null,
        },
      };
    case `${VERIFY_REGISTRATION}_FAIL`:
      return {
        ...state,
        verify: {
          loading: false,
          result: null,
          error: errorMessage(action.error),
        },
      };
    default:
      return state;
  }
}
