import type { ConfigType } from '@plone/registry';
import PlugManageRegistrations from '../components/Toolbar/PlugManageRegistrations';

/** Plug the registration desk button into the toolbar. */
export default function install(config: ConfigType) {
  config.settings.appExtras = [
    ...(config.settings.appExtras ?? []),
    { match: '', component: PlugManageRegistrations, props: {} },
  ];
  return config;
}
