// Registration
import RegistrationBlockEdit from './Edit';
import RegistrationBlockView from './View';
import { registrationSchema } from './schema';
import userSVG from '@plone/volto/icons/user.svg';
import type { BlockConfigBase } from '@plone/types';

const blockInfo: BlockConfigBase = {
  id: 'eventRegistration',
  title: 'Event Registration',
  group: 'event',
  icon: userSVG,
  blockSchema: registrationSchema as BlockConfigBase['blockSchema'],
  view: RegistrationBlockView,
  edit: RegistrationBlockEdit,
  restricted: false,
  mostUsed: false,
  sidebarTab: 1,
  blockHasOwnFocusManagement: false,
};

export default blockInfo;
