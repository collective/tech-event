// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { useSponsors } from './useSponsors';
import { LIST_SPONSORS } from '../constants/ActionTypes';

const benefits = [{ id: 'logo', title: 'Logo', description: '', levels: null }];
const levels = [
  {
    '@id': 'http://example.org/event/gold',
    id: 'gold',
    title: 'Gold',
    items: [],
    has_sponsors: false,
    exclude_from_nav: false,
    image_scales: null,
  },
];

function setup(eventRoot: string, sponsors: unknown) {
  const actions: any[] = [];
  const store = {
    getState: () => ({ sponsors }),
    subscribe: () => () => {},
    dispatch: (action: any) => {
      actions.push(action);
      return action;
    },
  };
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store as any}>{children}</Provider>
  );
  const hook = renderHook(() => useSponsors(eventRoot), { wrapper });
  return { actions, ...hook };
}

describe('useSponsors', () => {
  it('requests the sponsors of the event root', () => {
    const { actions } = setup('/event', {
      benefits: [],
      levels: [],
      loading: false,
      error: null,
    });
    expect(actions).toEqual([
      expect.objectContaining({
        type: LIST_SPONSORS,
        request: { op: 'get', path: '/event/@sponsors' },
      }),
    ]);
  });

  it('requests nothing without an event root', () => {
    const { actions } = setup('', {
      benefits: [],
      levels: [],
      loading: false,
      error: null,
    });
    expect(actions).toEqual([]);
  });

  it('returns the loaded benefits and levels', () => {
    const { result } = setup('/event', {
      benefits,
      levels,
      loading: false,
      error: null,
    });
    expect(result.current).toEqual({
      benefits,
      levels,
      loading: false,
      error: null,
    });
  });

  it('reports the loading state', () => {
    const { result } = setup('/event', {
      benefits: [],
      levels: [],
      loading: true,
      error: null,
    });
    expect(result.current).toEqual({
      benefits: [],
      levels: [],
      loading: true,
      error: null,
    });
  });

  it('reports the error state', () => {
    const { result } = setup('/event', {
      benefits: [],
      levels: [],
      loading: false,
      error: 'Forbidden',
    });
    expect(result.current.error).toBe('Forbidden');
    expect(result.current.levels).toEqual([]);
  });
});
