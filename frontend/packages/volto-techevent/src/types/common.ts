import type { BlockEditProps, Brain as BaseBrain } from '@plone/types';
import type { IntlShape } from 'react-intl';

/**
 * A vocabulary term as the REST API serializes a field that refers to a
 * vocabulary: a `token` and a `title`.
 */
export interface Term {
  token: string;
  title: string;
  /** Set on the entries of event settings, which are keyed by `id`. */
  id?: string;
}
export interface Link {
  '@id': string;
  title: string;
}

export interface RichText {
  'content-type': string;
  data: string;
  encoding: string;
}

export interface SocialLink {
  '@id': string;
  id: string;
  title: string;
  href: Link[];
}
export interface Brain extends BaseBrain {
  social_links: SocialLink[];
}
export interface ImageScale {
  download: string;
  height: number;
  width: number;
}
export interface ImageScales {
  'content-type': string;
  download: string;
  filename: string;
  height: number;
  scales: Record<string, ImageScale>;
  size: number;
  width: number;
}

export interface InheritedBehaviorFrom {
  '@id': string;
  title: string;
}

export interface BlockSchemaProps {
  props: BlockEditProps;
  intl: IntlShape;
}
export interface ScheduleBlockSchemaProps {
  props: BlockEditProps;
  intl: IntlShape;
  days: string[];
}
