import type { ConfigType } from '@plone/registry';
import PresenterView from '@plone-collective/volto-techevent/components/Presenter/PresenterView';
import SessionView from '@plone-collective/volto-techevent/components/Schedule/SessionView';
import SlotView from '@plone-collective/volto-techevent/components/Schedule/SlotView';
import SponsorView from '@plone-collective/volto-techevent/components/Sponsors/SponsorView';

export default function install(config: ConfigType) {
  config.views.contentTypesViews = {
    ...config.views.contentTypesViews,
    Presenter: PresenterView,
    Keynote: SessionView,
    Talk: SessionView,
    Training: SessionView,
    Sponsor: SponsorView,
    Slot: SlotView,
    LightningTalks: SlotView,
    Break: SlotView,
    Meeting: SlotView,
  };
  return config;
}
