import type { ConfigType } from '@plone/registry';
import ManageRegistrations from '../components/ManageRegistrations/ManageRegistrations';
import RegistrationVerify from '../components/Registration/RegistrationVerify';

/** The verification route, at the site root and below any event root. */
export const VERIFY_PATHS = ['/registration/verify', '/**/registration/verify'];

/** The registration desk, at the site root and below any event root. */
export const MANAGE_PATHS = [
  '/manage-registrations',
  '/**/manage-registrations',
];

export default function install(config: ConfigType) {
  config.settings.nonContentRoutes = [
    ...config.settings.nonContentRoutes,
    /\/registration\/verify$/,
    /\/manage-registrations$/,
  ];
  config.addonRoutes.push(
    ...VERIFY_PATHS.map((path) => ({ path, component: RegistrationVerify })),
    ...MANAGE_PATHS.map((path) => ({ path, component: ManageRegistrations })),
  );
  return config;
}
