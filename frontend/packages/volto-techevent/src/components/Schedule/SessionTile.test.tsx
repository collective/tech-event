import { describe, it, expect } from 'vitest';
import SessionTile from './SessionTile';
import { brainSession, eventStore } from './fixtures';
import { renderInVolto } from '../../testing/render';

describe('SessionTile', () => {
  it('shows the title, description, presenter, room and tags', () => {
    const { getByRole, getByText, container } = renderInVolto(
      <SessionTile
        item={brainSession}
        showDescription
        showAudience
        showLevel
      />,
      eventStore,
    );
    expect(getByRole('link', { name: 'Building with Volto' })).toBeTruthy();
    expect(getByText('Blocks, from zero to published.')).toBeTruthy();
    expect(getByRole('link', { name: 'Ada Lovelace' })).toBeTruthy();
    expect(container.querySelector('.slotRoom .title')?.textContent).toBe(
      'Room A',
    );
    expect(
      container.querySelector('.sessionAudience .audience')?.textContent,
    ).toBe('Developers');
    expect(
      container.querySelector('.sessionLevel .audience')?.textContent,
    ).toBe('Beginner');
    expect(container.querySelector('.sessionTrack .track')?.textContent).toBe(
      'Web',
    );
    expect(
      container.querySelector(
        '.sessionTile.Talk.session-volto.state-published',
      ),
    ).not.toBeNull();
  });

  it('hides the description, tags and room when told to', () => {
    const { container } = renderInVolto(
      <SessionTile
        item={brainSession}
        showDescription={false}
        showAudience={false}
        showLevel={false}
        showRoom={false}
      />,
      eventStore,
    );
    expect(container.querySelector('.sessionDescription')).toBeNull();
    expect(container.querySelector('.sessionAudiences')).toBeNull();
    expect(container.querySelector('.sessionLevels')).toBeNull();
    expect(container.querySelector('.slotRoom')).toBeNull();
    expect(container.querySelector('.sessionTrack .track')?.textContent).toBe(
      'Web',
    );
  });
});
