import type { BlockEditProps } from '@plone/types';
import type { IntlShape } from 'react-intl';

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
