// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
import Wrapper from '@plone/volto/storybook';
import ManageRegistrations, {
  TRANSITIONS,
  matches,
} from './ManageRegistrations';
import { attendeesListing, attendeesStore } from '../Registration/fixtures';
import type { AttendeesListing } from '../../types/registration';

function renderDesk(
  data: AttendeesListing | null = attendeesListing,
  store: Record<string, unknown> = attendeesStore(data),
) {
  return render(
    <Wrapper
      anonymous
      location="/registrations/manage-registrations"
      customStore={store}
    >
      <ManageRegistrations />
    </Wrapper>,
  );
}

// Volto's error pages read the site and the user session
const failed = (errorStatus: number, token: string | null = null) => ({
  attendees: { data: null, loading: false, error: 'Error', errorStatus },
  site: { data: {} },
  userSession: { token },
});

const rows = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('.attendees-table tbody tr'));

describe('matches', () => {
  const [ada] = attendeesListing.items;
  it.each(['', 'ada', 'LOVELACE', 'ada@example', 'pyc26-7kq'])(
    'finds Ada by %j',
    (search) => {
      expect(matches(ada, search)).toBe(true);
    },
  );

  it('leaves out other attendees', () => {
    expect(matches(ada, 'grace')).toBe(false);
  });
});

describe('TRANSITIONS', () => {
  it('offers the desk the transitions of each state', () => {
    expect(TRANSITIONS.pending.map((t) => t.id)).toEqual(['confirm', 'cancel']);
    expect(TRANSITIONS.registered.map((t) => t.id)).toEqual([
      'check_in',
      'cancel',
    ]);
    expect(TRANSITIONS.attended.map((t) => t.id)).toEqual(['undo_check_in']);
    expect(TRANSITIONS.cancelled.map((t) => t.id)).toEqual(['revert']);
  });
});

describe('ManageRegistrations', () => {
  it('has its own title', () => {
    const { container } = renderDesk();
    expect(container.querySelector('h1')?.textContent).toBe(
      'Manage registrations',
    );
  });

  it('lists the registrations with their email and state', () => {
    const { container } = renderDesk();
    expect(rows(container)).toHaveLength(2);
    const cells = Array.from(rows(container)[0].querySelectorAll('td')).map(
      (cell) => cell.textContent,
    );
    expect(cells.slice(0, 4)).toEqual([
      'PYC26-7KQ3M9XD',
      'Ada Lovelace',
      'ada@example.org',
      'Registered',
    ]);
    expect(cells[4]).toBe('Check inCancel');
  });

  it('links each code to its registration', () => {
    const { container } = renderDesk();
    const link = rows(container)[0].querySelector('td a');
    expect(link?.getAttribute('href')).toBe('/event/attendees/PYC26-7KQ3M9XD');
  });

  it('counts the registrations per state', () => {
    const { container } = renderDesk();
    const filters = Array.from(
      container.querySelectorAll('.attendees-filter .item'),
    ).map((item) => item.textContent);
    expect(filters).toEqual([
      'All (2)',
      'Pending (1)',
      'Registered (1)',
      'Attended (0)',
      'Cancelled (0)',
    ]);
  });

  it('searches by name, email or code', () => {
    const { container } = renderDesk();
    fireEvent.change(container.querySelector('.attendees-search input')!, {
      target: { value: 'grace' },
    });
    expect(rows(container)).toHaveLength(1);
    expect(rows(container)[0].textContent).toContain('Grace Hopper');
  });

  it('hides the actions from those who cannot review', () => {
    const { container } = renderDesk({
      ...attendeesListing,
      can_review: false,
    });
    expect(container.querySelectorAll('.attendees-table button')).toHaveLength(
      0,
    );
  });

  it('says when the deadline passed', () => {
    const { container } = renderDesk({
      ...attendeesListing,
      open: false,
      expired: true,
    });
    expect(container.querySelector('.registration-message')?.textContent).toBe(
      'The registration deadline has passed.',
    );
  });

  it('says when there are no registrations', () => {
    const { container } = renderDesk({
      ...attendeesListing,
      items: [],
      items_total: 0,
      counts: { pending: 0, registered: 0, attended: 0, cancelled: 0 },
    });
    expect(container.textContent).toContain('No registrations.');
  });

  it('shows no filters before the registrations load', () => {
    const { container } = renderDesk(null);
    expect(container.querySelector('.attendees-filter')).toBeNull();
    expect(container.querySelector('.attendees-table')).toBeNull();
  });

  it('is not found outside an Attendees container', () => {
    const { container } = renderDesk(null, failed(404));
    expect(container.textContent).toContain(
      'This page does not seem to exist…',
    );
    expect(container.querySelector('#page-manage-registrations')).toBeNull();
  });

  it('sends anonymous visitors to log in', () => {
    const { container } = renderDesk(null, failed(401));
    // Volto's Unauthorized page redirects to the login form
    expect(container.textContent).toBe('');
  });

  it.each([401, 403])('is unauthorized for other users (%i)', (status) => {
    const { container } = renderDesk(null, failed(status, 'token'));
    expect(container.textContent).toContain(
      'You are trying to access a protected resource.',
    );
    expect(container.querySelector('#page-manage-registrations')).toBeNull();
  });

  it('shows other errors on the desk', () => {
    const { container } = renderDesk(null, failed(500));
    expect(container.querySelector('.ui.error.message')?.textContent).toBe(
      'Error',
    );
  });
});
