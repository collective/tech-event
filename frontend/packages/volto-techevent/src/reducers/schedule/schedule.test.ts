import { describe, it, expect } from 'vitest';
import schedule from './schedule';
import { LIST_SCHEDULE } from '../../constants/ActionTypes';
import type { DaySchedule } from '../../types/schedule';

const days = [
  { id: '2026-10-13', items: [], rooms: ['Room A'] },
] as DaySchedule[];

const initial = { items: [], loading: false, error: null };

describe('schedule reducer', () => {
  it('starts empty', () => {
    expect(schedule(undefined, { type: '@@INIT' })).toEqual(initial);
  });

  it('returns the same state for unknown actions', () => {
    const state = { items: days, loading: false, error: null };
    expect(schedule(state, { type: 'SOMETHING_ELSE' })).toBe(state);
  });

  it('marks the schedule as loading and clears the old items', () => {
    const state = { items: days, loading: false, error: 'old' };
    expect(schedule(state, { type: `${LIST_SCHEDULE}_PENDING` })).toEqual({
      items: [],
      loading: true,
      error: null,
    });
  });

  it('stores the days on success', () => {
    const state = { ...initial, loading: true };
    expect(
      schedule(state, {
        type: `${LIST_SCHEDULE}_SUCCESS`,
        result: { items: days },
      }),
    ).toEqual({ items: days, loading: false, error: null });
  });

  it('stores no days when the success result has none', () => {
    const state = { ...initial, loading: true };
    expect(schedule(state, { type: `${LIST_SCHEDULE}_SUCCESS` })).toEqual({
      items: [],
      loading: false,
      error: null,
    });
  });

  it('stores the error message on failure', () => {
    const state = { ...initial, loading: true };
    expect(
      schedule(state, {
        type: `${LIST_SCHEDULE}_FAIL`,
        error: { response: { error: 'Not found' } },
      }),
    ).toEqual({ items: [], loading: false, error: 'Not found' });
  });

  it('reports an unknown error when the failure has no message', () => {
    const state = { ...initial, loading: true };
    expect(schedule(state, { type: `${LIST_SCHEDULE}_FAIL` })).toEqual({
      items: [],
      loading: false,
      error: 'Unknown error',
    });
  });
});
