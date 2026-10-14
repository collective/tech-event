import { describe, it, expect } from 'vitest';
import { listSponsors } from './sponsors';
import { LIST_SPONSORS } from '../../constants/ActionTypes';

describe('listSponsors', () => {
  it('gets @sponsors below the event root', () => {
    expect(listSponsors('/event')).toEqual({
      type: LIST_SPONSORS,
      request: { op: 'get', path: '/event/@sponsors' },
    });
  });

  it('keeps nested event roots', () => {
    expect(listSponsors('/en/events/conf').request.path).toBe(
      '/en/events/conf/@sponsors',
    );
  });
});
