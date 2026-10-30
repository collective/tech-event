import { describe, it, expect } from 'vitest';
import type { ConfigType } from '@plone/registry';
import installReducers from './reducers';
import attendees from '../reducers/attendees/attendees';
import registration from '../reducers/registration/registration';
import schedule from '../reducers/schedule/schedule';
import sponsors from '../reducers/sponsors/sponsors';

describe('installReducers', () => {
  it('registers the add-on reducers', () => {
    const config = installReducers({
      addonReducers: {},
    } as unknown as ConfigType);
    expect(config.addonReducers).toEqual({
      attendees,
      registration,
      schedule,
      sponsors,
    });
    expect(config.addonReducers.registration).toBe(registration);
    expect(config.addonReducers.schedule).toBe(schedule);
    expect(config.addonReducers.sponsors).toBe(sponsors);
  });

  it('keeps reducers other add-ons registered', () => {
    const other = () => ({});
    const config = installReducers({
      addonReducers: { other },
    } as unknown as ConfigType);
    expect(config.addonReducers.other).toBe(other);
  });
});
