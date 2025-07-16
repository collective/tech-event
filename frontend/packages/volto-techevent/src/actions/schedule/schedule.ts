/**
 * Schedule actions
 * @module actions/schedule/schedule
 */
import { flattenToAppURL } from '@plone/volto/helpers/Url/Url';
import { LIST_SCHEDULE } from '@plone-collective/volto-techevent/constants/ActionTypes';

export interface ListScheduleAction {
  type: typeof LIST_SCHEDULE;
  request: {
    op: 'get';
    path: string;
  };
}

/**
 * List Schedule function.
 * @function listSchedule
 * @param eventRoot - Path to the event root object.
 * @returns ListScheduleAction
 */
export function listSchedule(eventRoot: string): ListScheduleAction {
  return {
    type: LIST_SCHEDULE,
    request: {
      op: 'get',
      path: `${flattenToAppURL(eventRoot)}/@schedule`,
    },
  };
}
