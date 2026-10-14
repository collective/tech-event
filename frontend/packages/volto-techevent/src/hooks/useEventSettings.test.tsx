// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { useEventSettings } from './useEventSettings';
import type { EventSettings } from '../types/eventSettings';

const KEY = 'collective.techevent.event_settings';

const settings: EventSettings = {
  audience: [{ id: 'dev', title: 'Developers', color: '#00f' }],
  durations_keynote: [],
  durations_talk: [],
  durations_training: [],
  days: ['2026-10-13'],
  end: '2026-10-14T18:00:00',
  start: '2026-10-13T09:00:00',
  levels: [],
  tracks: [],
};

function wrapperFor(state: unknown) {
  const store = {
    getState: () => state,
    subscribe: () => () => {},
    dispatch: (action: unknown) => action,
  };
  return ({ children }: { children: React.ReactNode }) => (
    <Provider store={store as any}>{children}</Provider>
  );
}

describe('useEventSettings', () => {
  it('returns the event root and settings inherited from the event', () => {
    const state = {
      content: {
        data: {
          '@components': {
            inherit: {
              [KEY]: { from: { '@id': '/event' }, data: settings },
            },
          },
        },
      },
    };
    const { result } = renderHook(() => useEventSettings(), {
      wrapper: wrapperFor(state),
    });
    expect(result.current).toEqual({ eventRoot: '/event', data: settings });
  });

  it('returns empty defaults when no content is loaded', () => {
    const { result } = renderHook(() => useEventSettings(), {
      wrapper: wrapperFor({ content: {} }),
    });
    expect(result.current).toEqual({
      eventRoot: '',
      data: {
        audience: [],
        durations_keynote: [],
        durations_talk: [],
        durations_training: [],
        end: '',
        start: '',
        levels: [],
        tracks: [],
      },
    });
  });

  it('returns empty defaults when the behavior is not inherited', () => {
    const state = {
      content: { data: { '@components': { inherit: {} } } },
    };
    const { result } = renderHook(() => useEventSettings(), {
      wrapper: wrapperFor(state),
    });
    expect(result.current.eventRoot).toBe('');
    expect(result.current.data.audience).toEqual([]);
  });
});
