// SponsorsShowcase
import SponsorsShowcaseBlockEdit from './Edit';
import SponsorsShowcaseBlockView from './View';
import { sponsorsShowcaseSchema } from './schema';
import sponsorsSVG from '@plone/volto/icons/world.svg';
import type { BlockConfigBase } from '@plone/types';

const blockInfo: BlockConfigBase = {
  id: 'sponsorsShowcaseBlock',
  title: 'Packages and Sponsors',
  group: 'event-sponsors',
  category: 'sponsors',
  icon: sponsorsSVG,
  blockSchema: sponsorsShowcaseSchema,
  view: SponsorsShowcaseBlockView,
  edit: SponsorsShowcaseBlockEdit,
  restricted: false,
  mostUsed: false,
  sidebarTab: 1,
  blockHasOwnFocusManagement: false,
};

export default blockInfo;
