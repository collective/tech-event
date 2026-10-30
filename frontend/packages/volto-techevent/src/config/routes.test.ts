import { describe, it, expect } from 'vitest';
import type { ConfigType } from '@plone/registry';
import installRoutes from './routes';
import ManageRegistrations from '../components/ManageRegistrations/ManageRegistrations';
import RegistrationVerify from '../components/Registration/RegistrationVerify';

describe('installRoutes', () => {
  it('registers the registration routes, at the root and below an event', () => {
    const config = installRoutes({
      settings: { nonContentRoutes: [] },
      addonRoutes: [],
    } as unknown as ConfigType);
    expect(config.addonRoutes).toEqual([
      { path: '/registration/verify', component: RegistrationVerify },
      { path: '/**/registration/verify', component: RegistrationVerify },
      { path: '/manage-registrations', component: ManageRegistrations },
      { path: '/**/manage-registrations', component: ManageRegistrations },
    ]);
  });

  it('keeps the registration routes out of the content routes', () => {
    const config = installRoutes({
      settings: { nonContentRoutes: ['/login'] },
      addonRoutes: [],
    } as unknown as ConfigType);
    const [login, verify, manage] = config.settings.nonContentRoutes as [
      string,
      RegExp,
      RegExp,
    ];
    expect(login).toBe('/login');
    expect(verify.test('/registration/verify')).toBe(true);
    expect(verify.test('/event/registration/verify')).toBe(true);
    expect(verify.test('/event/registration')).toBe(false);
    expect(manage.test('/manage-registrations')).toBe(true);
    expect(manage.test('/event/manage-registrations')).toBe(true);
    expect(manage.test('/event/manage-registrations/x')).toBe(false);
  });

  it('no longer registers the attendee login route', () => {
    const config = installRoutes({
      settings: { nonContentRoutes: [] },
      addonRoutes: [],
    } as unknown as ConfigType);
    expect(
      config.addonRoutes.map((route: { path: string }) => route.path),
    ).not.toContain('/attendee-login');
  });

  it('keeps routes other add-ons registered', () => {
    const other = { path: '/other', component: () => null };
    const config = installRoutes({
      settings: { nonContentRoutes: [] },
      addonRoutes: [other],
    } as unknown as ConfigType);
    expect(config.addonRoutes).toHaveLength(5);
    expect(config.addonRoutes[0]).toBe(other);
  });
});
