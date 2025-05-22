import type { ConfigType } from '@plone/registry';

import sponsors from '@plone-collective/volto-techevent/reducers/sponsors/sponsors';

export default function install(config: ConfigType) {
  config.addonReducers = {
    ...config.addonReducers,
    sponsors,
  };
  return config;
}
