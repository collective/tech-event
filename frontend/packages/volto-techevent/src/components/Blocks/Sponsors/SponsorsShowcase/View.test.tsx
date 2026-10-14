// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import View from './View';
import { blockViewProps } from '../fixtures';
import { sponsorsStore } from '../../../Sponsors/fixtures';
import { renderInVolto } from '../../../../testing/render';

describe('SponsorsShowcase block view', () => {
  it('shows the title and one level per level with sponsors', () => {
    const { container } = renderInVolto(
      <View
        {...blockViewProps({
          type: 'sponsorsShowcaseBlock',
          data: { title: 'Packages' },
        })}
      />,
      sponsorsStore,
    );
    expect(container.querySelector('.sponsors.title')?.textContent).toBe(
      'Packages',
    );
    const levels = Array.from(
      container.querySelectorAll('.sponsorLevel .sponsor_title'),
    ).map((title) => title.textContent);
    expect(levels).toEqual(['Gold']);
  });

  it('shows the loading message while the sponsors load', () => {
    const store = {
      ...sponsorsStore,
      sponsors: { ...sponsorsStore.sponsors, loading: true },
    };
    const { container } = renderInVolto(
      <View {...blockViewProps({ type: 'sponsorsShowcaseBlock', data: {} })} />,
      store,
    );
    expect(container.querySelector('p')?.textContent).toBe('Loading sponsors…');
  });

  it('shows the error when the sponsors fail to load', () => {
    const store = {
      ...sponsorsStore,
      sponsors: { ...sponsorsStore.sponsors, error: 'Boom' },
    };
    const { container } = renderInVolto(
      <View {...blockViewProps({ type: 'sponsorsShowcaseBlock', data: {} })} />,
      store,
    );
    expect(container.querySelector('.error')?.textContent).toBe('Error: Boom');
  });

  it('shows no title without one', () => {
    const { container } = renderInVolto(
      <View {...blockViewProps({ type: 'sponsorsShowcaseBlock', data: {} })} />,
      sponsorsStore,
    );
    expect(container.querySelector('.sponsors.title')).toBeNull();
  });
});
