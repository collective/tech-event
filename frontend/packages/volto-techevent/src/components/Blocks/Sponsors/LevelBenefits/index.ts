// LevelBenefits
import LevelBenefitsBlockEdit from '@plone-collective/volto-techevent/components/Blocks/Sponsors/LevelBenefits/Edit';
import LevelBenefitsBlockView from '@plone-collective/volto-techevent/components/Blocks/Sponsors/LevelBenefits/View';
import { levelBenefitsSchema } from '@plone-collective/volto-techevent/components/Blocks/Sponsors/LevelBenefits/schema';
import { sponsorLevelRestrict } from '@plone-collective/volto-techevent/helpers/blocks';
import listSVG from '@plone/volto/icons/list-numbered.svg';
import type { BlockConfigBase } from '@plone/types';

const blockInfo: BlockConfigBase = {
  id: 'levelBenefitsBlock',
  title: 'Package Benefits',
  group: 'event-sponsors',
  category: 'sponsors',
  icon: listSVG,
  blockSchema: levelBenefitsSchema,
  view: LevelBenefitsBlockView,
  edit: LevelBenefitsBlockEdit,
  restricted: sponsorLevelRestrict,
  mostUsed: false,
  sidebarTab: 1,
  blockHasOwnFocusManagement: false,
};

export default blockInfo;
