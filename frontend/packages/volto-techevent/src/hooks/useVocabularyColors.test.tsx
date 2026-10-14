// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { useVocabularyColors } from './useVocabularyColors';

const KEY = 'collective.techevent.event_settings';

function wrapperFor(data?: Record<string, unknown>) {
  const state = data
    ? {
        content: {
          data: {
            '@components': {
              inherit: { [KEY]: { from: { '@id': '/event' }, data } },
            },
          },
        },
      }
    : { content: {} };
  const store = {
    getState: () => state,
    subscribe: () => () => {},
    dispatch: (action: unknown) => action,
  };
  return ({ children }: { children: React.ReactNode }) => (
    <Provider store={store as any}>{children}</Provider>
  );
}

describe('useVocabularyColors', () => {
  it('maps the id of each item of a vocabulary to its color', () => {
    const { result } = renderHook(() => useVocabularyColors('audience'), {
      wrapper: wrapperFor({
        audience: [
          { id: 'dev', title: 'Developers', color: '#00f' },
          { id: 'design', title: 'Designers', color: '#f00' },
        ],
      }),
    });
    expect(result.current).toEqual({ dev: '#00f', design: '#f00' });
  });

  it('returns an empty map for an empty vocabulary', () => {
    const { result } = renderHook(() => useVocabularyColors('levels'), {
      wrapper: wrapperFor({ levels: [] }),
    });
    expect(result.current).toEqual({});
  });

  it('returns an empty map for a vocabulary the settings do not have', () => {
    const { result } = renderHook(() => useVocabularyColors('tracks'), {
      wrapper: wrapperFor({ levels: [{ id: 'a', color: '#0f0' }] }),
    });
    expect(result.current).toEqual({});
  });

  it('returns an empty map when no settings are loaded', () => {
    const { result } = renderHook(() => useVocabularyColors('levels'), {
      wrapper: wrapperFor(),
    });
    expect(result.current).toEqual({});
  });
});
