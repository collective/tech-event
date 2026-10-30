import { describe, it, expect, vi } from 'vitest';
import type { ConfigType } from '@plone/registry';
import installViews from './views';

import AttendeeView from '../components/Attendee/AttendeeView';
import PresenterView from '../components/Presenter/PresenterView';
import SessionView from '../components/Schedule/SessionView';
import SlotView from '../components/Schedule/SlotView';
import SponsorView from '../components/Sponsors/SponsorView';
import LightningTalksView from '../components/Schedule/LightningTalksView';

// The social networks widget ships with volto-social-media, which Volto
// resolves through its addon alias; this project's vitest config does not
// set that alias, so the import is replaced with a stub here.
vi.mock(
  '@plonegovbr/volto-social-media/components/SocialNetworks/SocialNetworks',
  () => ({ default: () => null }),
);

describe('installViews', () => {
  it('maps each event content type to its view', () => {
    const config = installViews({ views: {} } as unknown as ConfigType);
    expect(config.views.contentTypesViews).toEqual({
      Attendee: AttendeeView,
      Break: SlotView,
      Keynote: SessionView,
      LightningTalks: LightningTalksView,
      Meeting: SlotView,
      OpenSpace: SessionView,
      Presenter: PresenterView,
      Slot: SlotView,
      Sponsor: SponsorView,
      Talk: SessionView,
      Training: SessionView,
    });
  });

  it('keeps the views Volto already registered', () => {
    const config = installViews({
      views: { contentTypesViews: { Document: 'DocumentView' } },
    } as unknown as ConfigType);
    expect(config.views.contentTypesViews.Document).toBe('DocumentView');
    expect(config.views.contentTypesViews.Talk).toBe(SessionView);
  });

  it('survives a registry with no content type views yet', () => {
    const config = installViews({ views: {} } as unknown as ConfigType);
    expect(config.views.contentTypesViews.Presenter).toBe(PresenterView);
  });
});
