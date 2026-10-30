import type { ConfigType } from '@plone/registry';

import attendees from '@plone-collective/volto-techevent/reducers/attendees/attendees';
import registration from '@plone-collective/volto-techevent/reducers/registration/registration';
import schedule from '@plone-collective/volto-techevent/reducers/schedule/schedule';
import sponsors from '@plone-collective/volto-techevent/reducers/sponsors/sponsors';

export default function install(config: ConfigType) {
  config.addonReducers = {
    ...config.addonReducers,
    attendees,
    registration,
    schedule,
    sponsors,
  };
  return config;
}
