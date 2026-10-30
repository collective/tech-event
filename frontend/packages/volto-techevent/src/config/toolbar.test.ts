import { describe, it, expect } from 'vitest';
import type { ConfigType } from '@plone/registry';
import installToolbar from './toolbar';
import PlugManageRegistrations from '../components/Toolbar/PlugManageRegistrations';

describe('installToolbar', () => {
  it('plugs the registration desk link on every page', () => {
    const config = installToolbar({
      settings: { appExtras: [] },
    } as unknown as ConfigType);
    expect(config.settings.appExtras).toEqual([
      { match: '', component: PlugManageRegistrations, props: {} },
    ]);
  });

  it('keeps the app extras of other add-ons', () => {
    const other = { match: '/other', component: () => null };
    const config = installToolbar({
      settings: { appExtras: [other] },
    } as unknown as ConfigType);
    expect(config.settings.appExtras).toHaveLength(2);
    expect(config.settings.appExtras[0]).toBe(other);
  });
});
