// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import Wrapper from '@plone/volto/storybook';
import ManageRegistrations from './ManageRegistrations';
import { attendeesStore } from '../Registration/fixtures';

// Volto's Toolbar needs the whole app store; the desk only decides what it
// gets, so a stub that renders its props stands in for it.
vi.mock('@plone/volto/components/manage/Toolbar/Toolbar', () => ({
  default: ({
    inner,
    hideDefaultViewButtons,
    pathname,
  }: {
    inner: React.ReactNode;
    hideDefaultViewButtons: boolean;
    pathname: string;
  }) => (
    <div
      className="toolbar-stub"
      data-hide-default={String(hideDefaultViewButtons)}
      data-pathname={pathname}
    >
      {inner}
    </div>
  ),
}));

function renderDesk() {
  return render(
    <Wrapper
      anonymous
      location="/registrations/manage-registrations"
      customStore={attendeesStore()}
    >
      <ManageRegistrations />
    </Wrapper>,
  );
}

afterEach(() => {
  document.getElementById('toolbar')?.remove();
});

describe('ManageRegistrations toolbar', () => {
  it('keeps the toolbar, with a button back to the container', () => {
    const node = document.createElement('div');
    node.id = 'toolbar';
    document.body.appendChild(node);
    renderDesk();
    const toolbar = node.querySelector('.toolbar-stub');
    expect(toolbar?.getAttribute('data-hide-default')).toBe('true');
    expect(toolbar?.getAttribute('data-pathname')).toBe(
      '/registrations/manage-registrations',
    );
    const back = toolbar?.querySelector('a');
    expect(back?.getAttribute('href')).toBe('/registrations');
    expect(back?.getAttribute('aria-label')).toBe('Back');
  });

  it('renders no toolbar where the page has no toolbar node', () => {
    const { container } = renderDesk();
    expect(document.querySelector('.toolbar-stub')).toBeNull();
    expect(container.querySelector('h1')?.textContent).toBe(
      'Manage registrations',
    );
  });
});
