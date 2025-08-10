import type { ConfigType } from '@plone/registry';
import AttendeeLogin from '../components/Attendee/AttendeeLogin';

export default function install(config: ConfigType) {
  config.settings.nonContentRoutes = [
    ...config.settings.nonContentRoutes,
    '/attendee-login',
  ];
  config.addonRoutes.push({
    path: '/attendee-login',
    component: AttendeeLogin,
  });
  return config;
}
