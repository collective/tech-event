// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import PresenterActivities from './PresenterActivities';
import { activityGroups } from './fixtures';
import { renderInVolto } from '../../testing/render';

// react-aria-components is pinned at a different version by the add-on than by
// @plone/components, so its real Tabs cannot be rendered in jsdom. The mock
// keeps the markup and the order of tabs and panels, which is what this
// component owns.
vi.mock('react-aria-components', () => ({
  Tab: ({ children }: { children: React.ReactNode }) => (
    <div role="tab">{children}</div>
  ),
  TabList: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div role="tablist" className={className}>
      {children}
    </div>
  ),
  TabPanel: ({
    id,
    className,
    children,
  }: {
    id: string;
    className?: string;
    children: React.ReactNode;
  }) => (
    <div id={id} className={className}>
      {children}
    </div>
  ),
}));

vi.mock('@plone/components', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@plone/components')>()),
  Tabs: ({
    className,
    children,
  }: {
    className?: string;
    children: React.ReactNode;
  }) => <div className={className}>{children}</div>,
}));

describe('PresenterActivities', () => {
  it('shows one tab per activity group, with its items', () => {
    const { getAllByRole, getByText } = renderInVolto(
      <PresenterActivities activities={activityGroups} />,
    );
    expect(getAllByRole('tab').map((tab) => tab.textContent)).toEqual([
      'Talks',
      'Workshops',
    ]);
    expect(getByText('Building with Volto')).toBeTruthy();
  });

  it('renders nothing without activities', () => {
    const { container } = renderInVolto(
      <PresenterActivities activities={[]} />,
    );
    expect(container.querySelector('[role="tablist"]')).toBeNull();
  });
});
