// Parallax Block configuration
import ParallaxBlockEdit from '@plone-collective/volto-techevent/components/Blocks/Parallax/Edit';
import ParallaxBlockView from '@plone-collective/volto-techevent/components/Blocks/Parallax/View';
import { parallaxSchema } from '@plone-collective/volto-techevent/components/Blocks/Parallax/schema';
import parallaxSVG from '@plone/volto/icons/image.svg';
import type { BlockConfigBase } from '@plone/types';

const blockInfo: BlockConfigBase = {
  id: 'parallaxBlock',
  title: 'Parallax Block',
  group: 'common',
  category: 'image',
  icon: parallaxSVG,
  blockSchema: parallaxSchema,
  restricted: false,
  view: ParallaxBlockView,
  edit: ParallaxBlockEdit,
  mostUsed: false,
  sidebarTab: 1,
  blockHasOwnFocusManagement: false,
};

export default blockInfo;
