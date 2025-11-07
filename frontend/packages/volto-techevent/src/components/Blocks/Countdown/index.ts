// Countdown Block configuration
import CountdownBlockEdit from '@plone-collective/volto-techevent/components/Blocks/Countdown/Edit';
import CountdownBlockView from '@plone-collective/volto-techevent/components/Blocks/Countdown/View';
import { countdownSchema } from '@plone-collective/volto-techevent/components/Blocks/Countdown/schema';
import countdownSVG from '@plone/volto/icons/clock.svg';
import type { BlockConfigBase } from '@plone/types';

const blockInfo: BlockConfigBase = {
  id: 'countdownBlock',
  title: 'Countdown Block',
  group: 'event',
  category: 'event',
  icon: countdownSVG,
  blockSchema: countdownSchema,
  restricted: false,
  view: CountdownBlockView,
  edit: CountdownBlockEdit,
  mostUsed: false,
  sidebarTab: 1,
  blockHasOwnFocusManagement: false,
};

export default blockInfo;
