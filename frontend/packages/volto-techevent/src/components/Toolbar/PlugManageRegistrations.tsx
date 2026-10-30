import React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { Plug } from '@plone/volto/components/manage/Pluggable';
import Icon from '@plone/volto/components/theme/Icon/Icon';
import settingsSVG from '@plone/volto/icons/settings.svg';
import {
  MANAGE_ROUTE,
  routeOf,
} from '@plone-collective/volto-techevent/helpers/registration';
import messages from '@plone-collective/volto-techevent/components/Registration/messages';

interface ContentActions {
  object?: { id: string }[];
  workflow?: { id: string }[];
}

/**
 * Whether the user organizes the registrations of a container: can edit it,
 * or change its state. The `@attendees` endpoint checks it again.
 * @param actions - The Volto actions of the container.
 */
export function isOrganizer(actions: ContentActions | undefined): boolean {
  return Boolean(
    actions?.object?.some((action) => action.id === 'edit') ||
      actions?.workflow?.length,
  );
}

/**
 * The toolbar button to the registration desk, shown only on an Attendees
 * container, to its organizers.
 */
export const ManageRegistrationsButton: React.FC = () => {
  const intl = useIntl();
  const { pathname } = useLocation();
  const content = useSelector(
    (state: { content?: { data?: { '@id'?: string; '@type'?: string } } }) =>
      state.content?.data,
  );
  const organizer = useSelector(
    (state: { actions?: { actions?: ContentActions } }) =>
      isOrganizer(state.actions?.actions),
  );
  if (content?.['@type'] !== 'Attendees' || !content['@id'] || !organizer) {
    return null;
  }
  const to = routeOf(content['@id'], MANAGE_ROUTE);
  if (pathname === to) return null;
  const label = intl.formatMessage(messages.manageRegistrations);
  return (
    <Link aria-label={label} className="manage-registrations" to={to}>
      <Icon name={settingsSVG} size="30px" title={label} />
    </Link>
  );
};

/** Plugs the registration desk button into the toolbar. */
const PlugManageRegistrations: React.FC = () => (
  <Plug pluggable="main.toolbar.top" id="manage-registrations">
    <ManageRegistrationsButton />
  </Plug>
);

export default PlugManageRegistrations;
