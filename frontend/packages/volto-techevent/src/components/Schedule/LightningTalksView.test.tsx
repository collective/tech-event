import { describe, it, expect } from 'vitest';
import LightningTalksView from './LightningTalksView';
import { eventStore, lightningTalksContent } from './fixtures';
import { renderInVolto } from '../../testing/render';

describe('LightningTalksView', () => {
  it('lists each talk with its title and presenters', () => {
    const { container } = renderInVolto(
      <LightningTalksView content={lightningTalksContent} />,
      eventStore,
    );
    const titles = Array.from(
      container.querySelectorAll('.talksList .sessionTitle .title'),
    ).map((el) => el.textContent);
    const presenters = Array.from(
      container.querySelectorAll('.talksList .presenters span'),
    ).map((el) => el.textContent);
    expect(titles).toEqual(['Fast forms', 'Fast search']);
    expect(presenters).toEqual(['Ada Lovelace', 'Grace Hopper']);
    expect(container.querySelector('.sessionDescription')?.textContent).toBe(
      'Five minutes each.',
    );
  });

  it('omits the talks section when there are no talks', () => {
    const { container } = renderInVolto(
      <LightningTalksView content={{ ...lightningTalksContent, talks: [] }} />,
      eventStore,
    );
    expect(container.querySelector('.sessionTalks')).toBeNull();
    expect(container.querySelector('.talksList')).toBeNull();
  });
});
