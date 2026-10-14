// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import View from './View';
import { blockViewProps } from '../fixtures';
import {
  sponsorAcme,
  sponsorBeta,
  sponsorsStore,
} from '../../../Sponsors/fixtures';
import { renderInVolto } from '../../../../testing/render';

const cta = {
  '@type': 'Link',
  href: [{ '@id': '/sponsors/join' }],
  displayCTA: true,
  label: 'Become a sponsor',
};

describe('SponsorLevel block view', () => {
  it('shows the title and the sponsors of its level', () => {
    const { container } = renderInVolto(
      <View
        {...blockViewProps({
          type: 'sponsorLevelBlock',
          data: { title: 'Our Top Partners' },
          content: { id: 'gold' },
        })}
      />,
      sponsorsStore,
    );
    expect(
      container.querySelector('.sponsorLevelBlock .title')?.textContent,
    ).toBe('Our Top Partners');
    const links = Array.from(
      container.querySelectorAll('.sponsorTile-link'),
    ).map((link) => link.getAttribute('href'));
    expect(links).toEqual([sponsorAcme['@id'], sponsorBeta['@id']]);
  });

  it('links to the call to action with its label', () => {
    const { container } = renderInVolto(
      <View
        {...blockViewProps({
          type: 'sponsorLevelBlock',
          data: cta,
          content: { id: 'gold' },
        })}
      />,
      sponsorsStore,
    );
    const link = container.querySelector('a.cta');
    expect(link?.textContent).toBe('Become a sponsor');
    expect(link?.getAttribute('href')).toBe('/sponsors/join');
  });

  it('falls back to a default label when the call to action has none', () => {
    const { container } = renderInVolto(
      <View
        {...blockViewProps({
          type: 'sponsorLevelBlock',
          data: { ...cta, label: '' },
          content: { id: 'gold' },
        })}
      />,
      sponsorsStore,
    );
    expect(container.querySelector('a.cta')?.textContent).toBe('Be the first!');
  });

  it('hides the call to action when it is not displayed', () => {
    const { container } = renderInVolto(
      <View
        {...blockViewProps({
          type: 'sponsorLevelBlock',
          data: { ...cta, displayCTA: false },
          content: { id: 'gold' },
        })}
      />,
      sponsorsStore,
    );
    expect(container.querySelector('.sponsorCTA')).toBeNull();
  });

  it('shows no sponsors for a level without any', () => {
    const { container } = renderInVolto(
      <View
        {...blockViewProps({
          type: 'sponsorLevelBlock',
          data: {},
          content: { id: 'silver' },
        })}
      />,
      sponsorsStore,
    );
    expect(container.querySelector('.sponsorTile')).toBeNull();
  });

  it('finds its level by the id of the properties when the content has none', () => {
    const { container } = renderInVolto(
      <View
        {...blockViewProps({
          type: 'sponsorLevelBlock',
          data: {},
          properties: { id: 'gold' },
        })}
      />,
      sponsorsStore,
    );
    expect(container.querySelectorAll('.sponsorTile')).toHaveLength(2);
  });
});
