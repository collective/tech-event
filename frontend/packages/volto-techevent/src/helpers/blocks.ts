import type { Content } from '@plone/types';

interface RestrictProps {
  properties: Content;
}

export const sponsorLevelRestrict = ({
  properties,
}: RestrictProps): boolean => {
  const contentType = properties?.['@type'];
  return contentType !== 'SponsorLevel';
};
