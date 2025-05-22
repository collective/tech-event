import type { ConfigType } from '@plone/registry';

import installBlocks from './config/blocks';
import installReducers from './config/reducers';
import installSettings from './config/settings';
import installViews from './config/views';
import installWidgets from './config/widgets';

export function applyConfig(config: ConfigType) {
  installSettings(config);
  installBlocks(config);
  installReducers(config);
  installViews(config);
  installWidgets(config);
  return config;
}

export default applyConfig;
