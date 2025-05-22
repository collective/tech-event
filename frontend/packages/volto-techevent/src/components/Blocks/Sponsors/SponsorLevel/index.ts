// SponsorLevel
import SponsorLevelBlockEdit from '@plone-collective/volto-techevent/components/Blocks/Sponsors/SponsorLevel/Edit';
import SponsorLevelBlockView from '@plone-collective/volto-techevent/components/Blocks/Sponsors/SponsorLevel/View';
import { sponsorLevelSchema } from '@plone-collective/volto-techevent/components/Blocks/Sponsors/SponsorLevel/schema';
import { sponsorLevelRestrict } from '@plone-collective/volto-techevent/helpers/blocks';
import listBulletSVG from '@plone/volto/icons/list-bullet.svg';
import type { BlockConfigBase } from '@plone/types';

const blockInfo: BlockConfigBase = {
  id: 'sponsorLevelBlock',
  title: 'Sponsors List',
  group: 'event-sponsors',
  category: 'sponsors',
  icon: listBulletSVG,
  blockSchema: sponsorLevelSchema,
  view: SponsorLevelBlockView,
  edit: SponsorLevelBlockEdit,
  restricted: sponsorLevelRestrict,
  mostUsed: false,
  sidebarTab: 1,
  blockHasOwnFocusManagement: false,
};

export default blockInfo;
