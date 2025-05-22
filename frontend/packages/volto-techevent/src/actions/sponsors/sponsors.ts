/**
 * Sponsors actions
 * @module actions/sponsors/sponsors
 */
import { flattenToAppURL } from '@plone/volto/helpers/Url/Url';
import { LIST_SPONSORS } from '@plone-collective/volto-techevent/constants/ActionTypes';

export interface ListSponsorsAction {
  type: typeof LIST_SPONSORS;
  request: {
    op: 'get';
    path: string;
  };
}

/**
 * List Sponsors function.
 * @function listSponsors
 * @param eventRoot - Path to the event root object.
 * @returns ListSponsorsAction
 */
export function listSponsors(eventRoot: string): ListSponsorsAction {
  return {
    type: LIST_SPONSORS,
    request: {
      op: 'get',
      path: `${flattenToAppURL(eventRoot)}/@sponsors`,
    },
  };
}
