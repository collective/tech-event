// Schedule
import ScheduleBlockEdit from './Edit';
import ScheduleBlockView from './View';
import { scheduleSchema } from './schema';
import scheduleSVG from '@plone/volto/icons/calendar.svg';
import type { BlockConfigBase } from '@plone/types';

const blockInfo: BlockConfigBase = {
  id: 'scheduleBlock',
  title: 'Schedule',
  group: 'event',
  category: 'event',
  icon: scheduleSVG,
  blockSchema: scheduleSchema,
  view: ScheduleBlockView,
  edit: ScheduleBlockEdit,
  restricted: false,
  mostUsed: false,
  sidebarTab: 1,
  blockHasOwnFocusManagement: false,
};

export default blockInfo;
