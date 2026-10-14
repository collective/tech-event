// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import PresenterView from './PresenterView';
import { activityGroups, presenterAda } from './fixtures';
import type { PresenterItem } from './types';
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

describe('PresenterView', () => {
  it('shows the name and each line of the description', () => {
    const { container } = renderInVolto(
      <PresenterView content={presenterAda} />,
    );
    expect(container.querySelector('.presenter-name')?.textContent).toBe(
      'Ada Lovelace',
    );
    const lines = Array.from(
      container.querySelectorAll('.documentDescription span'),
    ).map((span) => span.textContent);
    expect(lines).toEqual(['Analytical engine', 'First programmer']);
  });

  it('shows the category of each label', () => {
    const { container } = renderInVolto(
      <PresenterView content={presenterAda} />,
    );
    const icons = Array.from(
      container.querySelectorAll('.presenter-labels .presenterCategory'),
    ).map((icon) => icon.getAttribute('class') ?? '');
    expect(icons).toHaveLength(2);
    expect(icons[0]).toContain('speaker');
    expect(icons[1]).toContain('pf-member');
  });

  it('renders the HTML text', () => {
    const { container } = renderInVolto(
      <PresenterView content={presenterAda} />,
    );
    expect(container.querySelector('.presenterText')?.textContent).toBe(
      'She wrote the first program.',
    );
  });

  it('shows the activities as tabs', () => {
    const content = {
      ...presenterAda,
      activities: activityGroups,
    } as unknown as PresenterItem;
    const { getAllByRole } = renderInVolto(<PresenterView content={content} />);
    expect(getAllByRole('tab').map((tab) => tab.textContent)).toEqual([
      'Talks',
      'Workshops',
    ]);
  });

  it('hides the activities without any', () => {
    const { container } = renderInVolto(
      <PresenterView content={presenterAda} />,
    );
    expect(container.querySelector('.presenterActivities')).toBeNull();
  });
});
