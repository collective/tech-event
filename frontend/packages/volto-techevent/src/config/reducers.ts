import type { ConfigType } from '@plone/registry';

import schedule from '@plone-collective/volto-techevent/reducers/schedule/schedule';
import sponsors from '@plone-collective/volto-techevent/reducers/sponsors/sponsors';

export default function install(config: ConfigType) {
  config.addonReducers = {
    ...config.addonReducers,
    schedule,
    sponsors,
  };
  return config;
}
