import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import {
  Button,
  Container,
  Input,
  Menu,
  Message,
  Table,
} from 'semantic-ui-react';
import Helmet from '@plone/volto/helpers/Helmet/Helmet';
import Icon from '@plone/volto/components/theme/Icon/Icon';
import Toolbar from '@plone/volto/components/manage/Toolbar/Toolbar';
import { useClient } from '@plone/volto/hooks/client/useClient';
import backSVG from '@plone/volto/icons/back.svg';
import NotFound from '@plone/volto/components/theme/NotFound/NotFound';
import Unauthorized from '@plone/volto/components/theme/Unauthorized/Unauthorized';
import UniversalLink from '@plone/volto/components/manage/UniversalLink/UniversalLink';
import { transitionWorkflow } from '@plone/volto/actions/workflow/workflow';
import { listAttendees } from '@plone-collective/volto-techevent/actions/registration/registration';
import {
  MANAGE_ROUTE,
  contextFromPath,
} from '@plone-collective/volto-techevent/helpers/registration';
import messages from '@plone-collective/volto-techevent/components/Registration/messages';
import RegistrationDeadline from '@plone-collective/volto-techevent/components/Registration/RegistrationDeadline';
import RegistrationStateLabel from '@plone-collective/volto-techevent/components/Registration/RegistrationStateLabel';
import type { AttendeesReducerState } from '@plone-collective/volto-techevent/reducers/attendees/attendees';
import type {
  AttendeeItem,
  RegistrationState,
} from '@plone-collective/volto-techevent/types/registration';

const STATES: RegistrationState[] = [
  'pending',
  'registered',
  'attended',
  'cancelled',
];

/** The workflow transitions the registration desk offers, per state. */
export const TRANSITIONS: Record<
  RegistrationState,
  { id: string; label: keyof typeof messages }[]
> = {
  pending: [
    { id: 'confirm', label: 'confirm' },
    { id: 'cancel', label: 'cancel' },
  ],
  registered: [
    { id: 'check_in', label: 'checkIn' },
    { id: 'cancel', label: 'cancel' },
  ],
  attended: [{ id: 'undo_check_in', label: 'undoCheckIn' }],
  cancelled: [{ id: 'revert', label: 'revert' }],
};

/**
 * Whether an attendee matches a search: by name, email or code.
 * @param item - The attendee.
 * @param search - The search text.
 */
export function matches(item: AttendeeItem, search: string): boolean {
  const text = search.trim().toLowerCase();
  if (!text) return true;
  return [item.title, item.email, item.code].some((value) =>
    value.toLowerCase().includes(text),
  );
}

/**
 * The toolbar of the desk, as Volto shows it on its own routes: only a
 * button back to the Attendees container. It renders into the `#toolbar`
 * node of the page, when there is one.
 * @param container - The path of the Attendees container.
 */
const DeskToolbar: React.FC<{ container: string }> = ({ container }) => {
  const intl = useIntl();
  const { pathname } = useLocation();
  const node = document.getElementById('toolbar');
  if (!node) return null;
  const back = intl.formatMessage(messages.back);
  return createPortal(
    <Toolbar
      pathname={pathname}
      hideDefaultViewButtons
      inner={
        <Link to={container} className="item" aria-label={back}>
          <Icon
            name={backSVG}
            className="contents circled"
            size="30px"
            title={back}
          />
        </Link>
      }
    />,
    node,
  );
};

/**
 * The registration desk, at `manage-registrations` below an Attendees
 * container: its registrations, for its organizers. Anywhere else, the
 * page is not found.
 */
const ManageRegistrations: React.FC = () => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const location = useLocation();
  const container = contextFromPath(location.pathname, MANAGE_ROUTE);
  const isClient = useClient();
  const [reviewState, setReviewState] = useState<RegistrationState | ''>('');
  const [search, setSearch] = useState('');
  const { data, loading, error, errorStatus } = useSelector(
    (state: { attendees: AttendeesReducerState }) => state.attendees,
  );

  const reload = useCallback(() => {
    dispatch(listAttendees(container, reviewState || undefined));
  }, [dispatch, container, reviewState]);

  useEffect(() => {
    reload();
  }, [reload]);

  const transition = async (item: AttendeeItem, transitionId: string) => {
    await dispatch(
      transitionWorkflow(`${item['@id']}/@workflow/${transitionId}`) as any,
    );
    reload();
  };

  const items = useMemo(
    () => (data?.items ?? []).filter((item) => matches(item, search)),
    [data, search],
  );
  const total = data
    ? STATES.reduce((sum, state) => sum + data.counts[state], 0)
    : 0;
  const title = intl.formatMessage(messages.manageRegistrations);

  // Only an Attendees container has the @attendees endpoint
  if (errorStatus === 404) return <NotFound />;
  if (errorStatus === 401 || errorStatus === 403) return <Unauthorized />;

  return (
    <Container
      id="page-manage-registrations"
      className="view-wrapper manage-registrations"
    >
      <Helmet title={title} />
      {isClient && <DeskToolbar container={container} />}
      <h1 className="documentFirstHeading">{title}</h1>
      {data && (
        <p className="registration-message">
          {intl.formatMessage(
            data.open
              ? messages.registrationOpen
              : data.expired
                ? messages.deadlinePassed
                : messages.notOpen,
          )}
        </p>
      )}
      {data && !data.expired && (
        <RegistrationDeadline closesAt={data.closes_at} />
      )}
      {error && <Message error content={error} />}
      {data && (
        <>
          <Menu secondary pointing className="attendees-filter">
            <Menu.Item
              name="all"
              active={reviewState === ''}
              onClick={() => setReviewState('')}
            >
              {intl.formatMessage(messages.all)} ({total})
            </Menu.Item>
            {STATES.map((state) => (
              <Menu.Item
                key={state}
                name={state}
                active={reviewState === state}
                onClick={() => setReviewState(state)}
              >
                <RegistrationStateLabel state={state} /> ({data.counts[state]})
              </Menu.Item>
            ))}
          </Menu>
          <Input
            className="attendees-search"
            icon="search"
            placeholder={intl.formatMessage(messages.search)}
            aria-label={intl.formatMessage(messages.search)}
            value={search}
            onChange={(_event, { value }) => setSearch(value)}
          />
        </>
      )}
      {!loading && data && items.length === 0 && (
        <p>{intl.formatMessage(messages.noAttendees)}</p>
      )}
      {items.length > 0 && (
        <Table celled compact className="attendees-table">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>
                {intl.formatMessage(messages.code)}
              </Table.HeaderCell>
              <Table.HeaderCell>
                {intl.formatMessage(messages.name)}
              </Table.HeaderCell>
              <Table.HeaderCell>
                {intl.formatMessage(messages.email)}
              </Table.HeaderCell>
              <Table.HeaderCell>
                {intl.formatMessage(messages.status)}
              </Table.HeaderCell>
              {data?.can_review && (
                <Table.HeaderCell>
                  {intl.formatMessage(messages.actions)}
                </Table.HeaderCell>
              )}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {items.map((item) => (
              <Table.Row key={item.UID}>
                <Table.Cell className="registration-code">
                  {item['@id'] ? (
                    <UniversalLink href={item['@id']}>
                      {item.code}
                    </UniversalLink>
                  ) : (
                    item.code
                  )}
                </Table.Cell>
                <Table.Cell>{item.title}</Table.Cell>
                <Table.Cell>{item.email}</Table.Cell>
                <Table.Cell>
                  <RegistrationStateLabel state={item.state} />
                </Table.Cell>
                {data?.can_review && (
                  <Table.Cell>
                    {TRANSITIONS[item.state].map(({ id, label }) => (
                      <Button
                        key={id}
                        size="small"
                        basic={id !== 'check_in'}
                        primary={id === 'check_in'}
                        disabled={loading}
                        onClick={() => transition(item, id)}
                      >
                        {intl.formatMessage(messages[label])}
                      </Button>
                    ))}
                  </Table.Cell>
                )}
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </Container>
  );
};

export default ManageRegistrations;
