import { describe, it, expect } from 'vitest';
import sponsors from './sponsors';
import { LIST_SPONSORS } from '../../constants/ActionTypes';
import type { SponsorsLevels } from '../../types/sponsors';

const result = {
  '@id': 'http://example.org/event/@sponsors',
  items: [
    {
      '@id': 'http://example.org/event/gold',
      id: 'gold',
      title: 'Gold',
      items: [],
      has_sponsors: false,
      exclude_from_nav: false,
      image_scales: null,
    },
  ],
  benefits: [
    {
      id: 'logo',
      title: 'Logo',
      description: '',
      levels: { gold: 'yes' },
    },
  ],
} as SponsorsLevels;

const initial = { benefits: [], levels: [], loading: false, error: null };

describe('sponsors reducer', () => {
  it('starts empty', () => {
    expect(sponsors(undefined, { type: '@@INIT' })).toEqual(initial);
  });

  it('returns the same state for unknown actions', () => {
    const state = { ...initial, loading: true };
    expect(sponsors(state, { type: 'SOMETHING_ELSE' })).toBe(state);
  });

  it('marks the sponsors as loading and clears the old data', () => {
    const state = {
      benefits: result.benefits,
      levels: result.items,
      loading: false,
      error: 'old',
    };
    expect(sponsors(state, { type: `${LIST_SPONSORS}_PENDING` })).toEqual({
      benefits: [],
      levels: [],
      loading: true,
      error: null,
    });
  });

  it('stores the levels and benefits on success', () => {
    const state = { ...initial, loading: true };
    expect(
      sponsors(state, { type: `${LIST_SPONSORS}_SUCCESS`, result }),
    ).toEqual({
      benefits: result.benefits,
      levels: result.items,
      loading: false,
      error: null,
    });
  });

  it('stores nothing when the success result is empty', () => {
    const state = { ...initial, loading: true };
    expect(sponsors(state, { type: `${LIST_SPONSORS}_SUCCESS` })).toEqual(
      initial,
    );
  });

  it('stores the error message on failure', () => {
    const state = { ...initial, loading: true };
    expect(
      sponsors(state, {
        type: `${LIST_SPONSORS}_FAIL`,
        error: { response: { error: 'Forbidden' } },
      }),
    ).toEqual({ ...initial, error: 'Forbidden' });
  });

  it('reports an unknown error when the failure has no message', () => {
    const state = { ...initial, loading: true };
    expect(sponsors(state, { type: `${LIST_SPONSORS}_FAIL` })).toEqual({
      ...initial,
      error: 'Unknown error',
    });
  });
});
