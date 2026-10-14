import type { Image } from '@plone/types';
import type { Term } from '@plone-collective/volto-techevent/types/common';
import type { Presenter } from '@plone-collective/volto-techevent/types/presenter';

/**
 * A presenter as the views receive it: the base type plus the fields the
 * API sends for presenters that the base type does not declare.
 * Volto reads each image scale field as a list, so `image_scales` maps a
 * field to a list of images.
 */
export type PresenterItem = Omit<Presenter, 'image_scales'> & {
  image_scales?: Record<string, Image[]> | null;
  text?: { data: string };
  /** Categories are either full terms or their tokens. */
  categories?: Array<Term | string>;
};
