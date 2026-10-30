import { describe, it, expect } from 'vitest';
import attendees, { initialState } from './attendees';
import { LIST_ATTENDEES } from '../../constants/ActionTypes';
import { attendeesListing } from '../../components/Registration/fixtures';

describe('attendees reducer', () => {
  it('starts empty', () => {
    expect(attendees(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('returns the same state for unknown actions', () => {
    expect(attendees(initialState, { type: 'OTHER' })).toBe(initialState);
  });

  it('keeps the list while the next one loads', () => {
    const state = attendees(
      { ...initialState, data: attendeesListing },
      { type: `${LIST_ATTENDEES}_PENDING` },
    );
    expect(state.loading).toBe(true);
    expect(state.data).toBe(attendeesListing);
  });

  it('stores the list', () => {
    const state = attendees(initialState, {
      type: `${LIST_ATTENDEES}_SUCCESS`,
      result: attendeesListing,
    });
    expect(state).toEqual({
      data: attendeesListing,
      loading: false,
      error: null,
      errorStatus: null,
    });
  });

  it('stores the error and its status, without the previous list', () => {
    const state = attendees(
      { ...initialState, data: attendeesListing },
      {
        type: `${LIST_ATTENDEES}_FAIL`,
        error: {
          status: 401,
          response: { body: { error: { message: 'No' } } },
        },
      },
    );
    expect(state.error).toBe('No');
    expect(state.errorStatus).toBe(401);
    expect(state.data).toBeNull();
  });

  it('clears the error status when the next list loads', () => {
    const state = attendees(
      { ...initialState, error: 'Not found', errorStatus: 404 },
      { type: `${LIST_ATTENDEES}_PENDING` },
    );
    expect(state.errorStatus).toBeNull();
  });
});
