import type { ConfigType } from '@plone/registry';
import PresenterView from '@plone-collective/volto-techevent/components/Presenter/PresenterView';
import SessionView from '@plone-collective/volto-techevent/components/Schedule/SessionView';
import SlotView from '@plone-collective/volto-techevent/components/Schedule/SlotView';
import SponsorView from '@plone-collective/volto-techevent/components/Sponsors/SponsorView';
import LightningTalksView from '@plone-collective/volto-techevent/components/Schedule/LightningTalksView';

export default function install(config: ConfigType) {
  config.views.contentTypesViews = {
    ...config.views.contentTypesViews,
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
  };
  return config;
}
