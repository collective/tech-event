// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import settingsSVG from '@plone/volto/icons/settings.svg';
import { render } from '@testing-library/react';
import Wrapper from '@plone/volto/storybook';
import {
  Pluggable,
  PluggablesProvider,
} from '@plone/volto/components/manage/Pluggable';
import PlugManageRegistrations, {
  ManageRegistrationsButton,
  isOrganizer,
} from './PlugManageRegistrations';

// Record the icon each button renders, to check it is the cog
const icons = vi.hoisted(() => [] as unknown[]);
vi.mock('@plone/volto/components/theme/Icon/Icon', () => ({
  default: ({ name }: { name: unknown }) => {
    icons.push(name);
    return null;
  },
}));

const attendees = {
  '@id': 'http://localhost:3000/registrations',
  '@type': 'Attendees',
};
const editor = { object: [{ id: 'view' }, { id: 'edit' }], workflow: [] };
const reviewer = { object: [{ id: 'view' }], workflow: [{ id: 'close' }] };
const visitor = { object: [{ id: 'view' }], workflow: [] };

function store(content: object, actions: object) {
  return { content: { data: content }, actions: { actions } };
}

function renderButton(content: object, actions: object, location = '/') {
  return render(
    <Wrapper
      anonymous
      location={location}
      customStore={store(content, actions)}
    >
      <ManageRegistrationsButton />
    </Wrapper>,
  );
}

describe('isOrganizer', () => {
  it.each([
    ['editors', editor, true],
    ['reviewers', reviewer, true],
    ['visitors', visitor, false],
    ['missing actions', undefined, false],
  ])('%s', (_name, actions, expected) => {
    expect(isOrganizer(actions)).toBe(expected);
  });
});

describe('ManageRegistrationsButton', () => {
  it('links organizers to the desk of the Attendees container', () => {
    const { container } = renderButton(attendees, editor, '/registrations');
    const link = container.querySelector('a.manage-registrations');
    expect(link?.getAttribute('href')).toBe(
      '/registrations/manage-registrations',
    );
    expect(link?.getAttribute('aria-label')).toBe('Manage registrations');
  });

  it('shows a cog', () => {
    icons.length = 0;
    renderButton(attendees, editor);
    expect(icons).toEqual([settingsSVG]);
  });

  it('shows to reviewers too', () => {
    const { container } = renderButton(attendees, reviewer);
    expect(container.querySelector('a.manage-registrations')).not.toBeNull();
  });

  it('hides from those who do not organize the registrations', () => {
    const { container } = renderButton(attendees, visitor);
    expect(container.querySelector('a')).toBeNull();
  });

  it.each(['Document', 'Tech Event', 'Attendee'])('hides on a %s', (type) => {
    const { container } = renderButton(
      { '@id': 'http://localhost:3000/page', '@type': type },
      editor,
    );
    expect(container.querySelector('a')).toBeNull();
  });

  it('hides on the desk itself', () => {
    const { container } = renderButton(
      attendees,
      editor,
      '/registrations/manage-registrations',
    );
    expect(container.querySelector('a')).toBeNull();
  });
});

describe('PlugManageRegistrations', () => {
  it('plugs the button into the toolbar', () => {
    const { container } = render(
      <Wrapper anonymous customStore={store(attendees, editor)}>
        <PluggablesProvider>
          <div className="toolbar-actions">
            <Pluggable name="main.toolbar.top" />
          </div>
          <PlugManageRegistrations />
        </PluggablesProvider>
      </Wrapper>,
    );
    expect(
      container.querySelector('.toolbar-actions a.manage-registrations'),
    ).not.toBeNull();
  });
});
