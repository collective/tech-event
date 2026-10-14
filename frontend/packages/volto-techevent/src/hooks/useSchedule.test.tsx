// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { useSchedule } from './useSchedule';
import { LIST_SCHEDULE } from '../constants/ActionTypes';
import type { DaySchedule } from '../types/schedule';

const days = [{ id: '2026-10-13', items: [], rooms: [] }] as DaySchedule[];

function makeStore(schedule: unknown) {
  const actions: any[] = [];
  const store = {
    getState: () => ({ schedule }),
    subscribe: () => () => {},
    dispatch: (action: any) => {
      actions.push(action);
      return action;
    },
  };
  return { store, actions };
}

function setup(eventRoot: string, schedule: unknown) {
  const { store, actions } = makeStore(schedule);
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store as any}>{children}</Provider>
  );
  const hook = renderHook(() => useSchedule(eventRoot), { wrapper });
  return { actions, ...hook };
}

describe('useSchedule', () => {
  let loaded: { items: DaySchedule[]; loading: boolean; error: null };

  beforeEach(() => {
    loaded = { items: days, loading: false, error: null };
  });

  it('requests the schedule of the event root', () => {
    const { actions } = setup('/event', loaded);
    expect(actions).toEqual([
      expect.objectContaining({
        type: LIST_SCHEDULE,
        request: { op: 'get', path: '/event/@schedule' },
      }),
    ]);
  });

  it('requests nothing without an event root', () => {
    const { actions } = setup('', loaded);
    expect(actions).toEqual([]);
  });

  it('returns the loaded days', () => {
    const { result } = setup('/event', loaded);
    expect(result.current).toEqual({
      items: days,
      loading: false,
      error: null,
    });
  });

  it('reports the loading state', () => {
    const { result } = setup('/event', {
      items: [],
      loading: true,
      error: null,
    });
    expect(result.current).toEqual({ items: [], loading: true, error: null });
  });

  it('reports the error state', () => {
    const { result } = setup('/event', {
      items: [],
      loading: false,
      error: 'Not found',
    });
    expect(result.current).toEqual({
      items: [],
      loading: false,
      error: 'Not found',
    });
  });
});
