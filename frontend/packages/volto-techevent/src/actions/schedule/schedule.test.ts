import { describe, it, expect } from 'vitest';
import { listSchedule } from './schedule';
import { LIST_SCHEDULE } from '../../constants/ActionTypes';

describe('listSchedule', () => {
  it('gets @schedule below the event root', () => {
    expect(listSchedule('/event')).toEqual({
      type: LIST_SCHEDULE,
      request: { op: 'get', path: '/event/@schedule' },
    });
  });

  it('keeps nested event roots', () => {
    expect(listSchedule('/en/events/conf').request.path).toBe(
      '/en/events/conf/@schedule',
    );
  });
});
