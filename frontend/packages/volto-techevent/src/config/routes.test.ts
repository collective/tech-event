import { describe, it, expect } from 'vitest';
import type { ConfigType } from '@plone/registry';
import installRoutes from './routes';
import AttendeeLogin from '../components/Attendee/AttendeeLogin';

describe('installRoutes', () => {
  it('registers the attendee login route', () => {
    const config = installRoutes({
      settings: { nonContentRoutes: [] },
      addonRoutes: [],
    } as unknown as ConfigType);
    expect(config.addonRoutes).toEqual([
      { path: '/attendee-login', component: AttendeeLogin },
    ]);
  });

  it('keeps the attendee login out of the content routes', () => {
    const config = installRoutes({
      settings: { nonContentRoutes: ['/login'] },
      addonRoutes: [],
    } as unknown as ConfigType);
    expect(config.settings.nonContentRoutes).toEqual([
      '/login',
      '/attendee-login',
    ]);
  });

  it('keeps routes other add-ons registered', () => {
    const other = { path: '/other', component: () => null };
    const config = installRoutes({
      settings: { nonContentRoutes: [] },
      addonRoutes: [other],
    } as unknown as ConfigType);
    expect(config.addonRoutes).toHaveLength(2);
    expect(config.addonRoutes[0]).toBe(other);
  });
});
