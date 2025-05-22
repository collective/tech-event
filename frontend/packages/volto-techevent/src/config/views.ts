import type { ConfigType } from '@plone/registry';
import PresenterView from '@plone-collective/volto-techevent/components/Presenter/PresenterView';
import SponsorView from '@plone-collective/volto-techevent/components/Sponsors/SponsorView';

export default function install(config: ConfigType) {
  config.views.contentTypesViews = {
    ...config.views.contentTypesViews,
    Presenter: PresenterView,
    Sponsor: SponsorView,
  };
  return config;
}
