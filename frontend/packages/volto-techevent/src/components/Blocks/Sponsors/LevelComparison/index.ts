// LevelComparison
import LevelComparisonBlockEdit from '@plone-collective/volto-techevent/components/Blocks/Sponsors/LevelComparison/Edit';
import LevelComparisonBlockView from '@plone-collective/volto-techevent/components/Blocks/Sponsors/LevelComparison/View';
import { levelComparisonSchema } from '@plone-collective/volto-techevent/components/Blocks/Sponsors/LevelComparison/schema';
import spreadsheetSVG from '@plone/volto/icons/spreadsheet.svg';
import type { BlockConfigBase } from '@plone/types';

const blockInfo: BlockConfigBase = {
  id: 'levelComparisonBlock',
  title: 'Package Comparison',
  group: 'event-sponsors',
  category: 'sponsors',
  icon: spreadsheetSVG,
  blockSchema: levelComparisonSchema,
  view: LevelComparisonBlockView,
  edit: LevelComparisonBlockEdit,
  restricted: false,
  mostUsed: false,
  sidebarTab: 1,
  blockHasOwnFocusManagement: false,
};

export default blockInfo;
