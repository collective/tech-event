// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { fireEvent } from '@testing-library/react';
import PresenterCategory from './PresenterCategory';
import { renderInVolto } from '../../testing/render';

describe('PresenterCategory', () => {
  it('shows the icon of the category', () => {
    const { container } = renderInVolto(
      <PresenterCategory label={{ token: 'speaker', title: 'Speaker' }} />,
    );
    expect(
      container.querySelector('.presenterCategory.speaker'),
    ).not.toBeNull();
  });

  it('names the category by its title when it has one', async () => {
    const { container, findByText } = renderInVolto(
      <PresenterCategory
        label={{ token: 'pf-member', title: 'Plone Foundation Member' }}
      />,
    );
    const trigger = container.querySelector('.presenterCategoryWrapper');
    fireEvent.mouseEnter(trigger as Element);
    expect((await findByText('Plone Foundation Member')).textContent).toBe(
      'Plone Foundation Member',
    );
  });

  it('accepts a bare token string and uses its default title', async () => {
    const { container, findByText } = renderInVolto(
      <PresenterCategory label={'speaker' as any} />,
    );
    expect(
      container.querySelector('.presenterCategory.speaker'),
    ).not.toBeNull();
    fireEvent.mouseEnter(
      container.querySelector('.presenterCategoryWrapper') as Element,
    );
    expect((await findByText('Speaker')).textContent).toBe('Speaker');
  });

  it('falls back to the default title for a term without a title', async () => {
    const { container, findByText } = renderInVolto(
      <PresenterCategory label={{ token: 'keynote-speaker' } as any} />,
    );
    expect(
      container.querySelector('.presenterCategory.keynote-speaker'),
    ).not.toBeNull();
    fireEvent.mouseEnter(
      container.querySelector('.presenterCategoryWrapper') as Element,
    );
    expect((await findByText('Keynote Speaker')).textContent).toBe(
      'Keynote Speaker',
    );
  });
});
