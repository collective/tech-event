import type { BlocksFormData } from '@plone/types';
import type { IntlShape } from 'react-intl';
import type { SponsorInfo } from '@plone-collective/volto-techevent/types/sponsors';

/**
 * Arguments of a block schema function. Volto passes its `BlockSchemaArgs`,
 * whose `intl` is a stub type from `@plone/types`; the schemas use react-intl's
 * `IntlShape`, as the rest of the add-on does. The block `index.ts` files cast
 * their schema to `BlockConfigBase['blockSchema']` to bridge the two.
 */
export type SponsorsSchemaArgs = {
  intl?: IntlShape;
  [key: string]: unknown;
};

/** The styles object that Volto's styling widget stores on a block. */
export type SponsorsStyles = Record<string, any>;

/** A sponsor as the tile receives it: the API may send an `id` beside `@id`. */
export type SponsorTileItem = SponsorInfo & { id?: string };

/** The data of the sponsor level block. */
export type SponsorLevelBlockData = BlocksFormData & {
  title?: string;
  href?: Array<{ '@id': string }>;
  label?: string;
  displayCTA?: boolean;
  styles?: SponsorsStyles;
};

/** The data of the sponsors showcase block. */
export type SponsorsShowcaseBlockData = BlocksFormData & {
  title?: string;
  styles?: SponsorsStyles;
};

/** The data of the package benefits block. */
export type LevelBenefitsBlockData = BlocksFormData & {
  title?: string;
  tableTitle?: string;
};

/** The data of the package comparison block. */
export type LevelComparisonBlockData = BlocksFormData & {
  title?: string;
  tableTitle?: string;
};
