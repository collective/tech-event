import { describe, it, expect } from 'vitest';
import SessionLevel from './SessionLevel';
import { brainSession, eventStore } from './fixtures';
import { renderInVolto } from '../../testing/render';

const VAR = '--vocabulary-background-color';

describe('SessionLevel', () => {
  it('shows each level as a pill colored from the event settings', () => {
    const { container } = renderInVolto(
      <SessionLevel item={brainSession} />,
      eventStore,
    );
    const pill = container.querySelector<HTMLElement>('.sessionLevel');
    expect(pill?.style.getPropertyValue(VAR)).toBe('#00ff00');
    expect(container.querySelector('.audience.beginner')?.textContent).toBe(
      'Beginner',
    );
  });

  it('uses "unset" for a level without a color', () => {
    const { container } = renderInVolto(
      <SessionLevel
        item={{ session_level: [{ token: 'expert', title: 'Expert' }] }}
      />,
      eventStore,
    );
    const pill = container.querySelector<HTMLElement>('.sessionLevel');
    expect(pill?.style.getPropertyValue(VAR)).toBe('unset');
  });

  it('renders nothing without a level', () => {
    const { container } = renderInVolto(
      <SessionLevel item={{ session_level: [] }} />,
      eventStore,
    );
    expect(container.querySelector('.sessionLevels')).toBeNull();
  });
});
