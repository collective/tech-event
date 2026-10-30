import { describe, it, expect } from 'vitest';
import registration, { errorMessage, initialState } from './registration';
import {
  CANCEL_REGISTRATION,
  GET_REGISTRATION,
  POST_REGISTRATION,
  VERIFY_REGISTRATION,
} from '../../constants/ActionTypes';
import type {
  Registration,
  RegistrationStatus,
} from '../../types/registration';

const status: RegistrationStatus = {
  '@id': 'http://example.org/event/@registration',
  state: 'open',
  open: true,
  closes_at: null,
  expired: false,
  allow_anonymous_registration: false,
  registration_confirmation: 'automatic',
  registration: null,
};

const registered: Registration = {
  code: 'PYC26-7KQ3M9XD',
  state: 'registered',
  first_name: 'Ada',
  last_name: 'Lovelace',
  email: 'ada@example.org',
  email_verified: true,
};

const apiError = (status: number, message: string) => ({
  status,
  response: { body: { error: { type: 'X', message } } },
});

describe('errorMessage', () => {
  it('reads the message of a plone.restapi error', () => {
    expect(errorMessage(apiError(403, 'Closed'))).toBe('Closed');
  });

  it('falls back to a generic message', () => {
    expect(errorMessage(undefined)).toBe('Unknown error');
  });
});

describe('registration reducer', () => {
  it('starts empty', () => {
    expect(registration(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('returns the same state for unknown actions', () => {
    expect(registration(initialState, { type: 'OTHER' })).toBe(initialState);
  });

  it('stores the status', () => {
    const state = registration(initialState, {
      type: `${GET_REGISTRATION}_SUCCESS`,
      result: status,
    });
    expect(state.status).toEqual(status);
    expect(state.loading).toBe(false);
  });

  it('treats a 404 as an event without registration', () => {
    const state = registration(
      { ...initialState, loading: true },
      { type: `${GET_REGISTRATION}_FAIL`, error: apiError(404, 'Not found') },
    );
    expect(state.status).toBeNull();
    expect(state.error).toBeNull();
  });

  it('keeps other errors', () => {
    const state = registration(initialState, {
      type: `${GET_REGISTRATION}_FAIL`,
      error: apiError(500, 'Boom'),
    });
    expect(state.error).toBe('Boom');
  });

  it.each([POST_REGISTRATION, CANCEL_REGISTRATION])(
    'stores the registration after %s',
    (type) => {
      const pending = registration(
        { ...initialState, status },
        { type: `${type}_PENDING` },
      );
      expect(pending.submitting).toBe(true);
      const state = registration(pending, {
        type: `${type}_SUCCESS`,
        result: registered,
      });
      expect(state.submitting).toBe(false);
      expect(state.status?.registration).toEqual(registered);
    },
  );

  it('stores the message of a refused registration', () => {
    const state = registration(
      { ...initialState, status, submitting: true },
      {
        type: `${POST_REGISTRATION}_FAIL`,
        error: apiError(403, 'The registration deadline has passed.'),
      },
    );
    expect(state.submitting).toBe(false);
    expect(state.submitError).toBe('The registration deadline has passed.');
    expect(state.status).toEqual(status);
  });

  it('tracks the verification', () => {
    const pending = registration(initialState, {
      type: `${VERIFY_REGISTRATION}_PENDING`,
    });
    expect(pending.verify.loading).toBe(true);
    const done = registration(pending, {
      type: `${VERIFY_REGISTRATION}_SUCCESS`,
      result: registered,
    });
    expect(done.verify).toEqual({
      loading: false,
      result: registered,
      error: null,
    });
    const failed = registration(pending, {
      type: `${VERIFY_REGISTRATION}_FAIL`,
      error: apiError(400, 'This link is invalid or has expired.'),
    });
    expect(failed.verify.error).toBe('This link is invalid or has expired.');
  });
});
