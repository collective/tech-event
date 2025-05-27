import type { Content } from '@plone/types';
import type { SocialLink } from './common';

export interface Presenter extends Content {
  social_links: SocialLink[] | null;
  activities: [];
}
