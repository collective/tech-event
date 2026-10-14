import { describe, it, expect } from 'vitest';
import SessionAudience from './SessionAudience';
import { brainSession, eventStore } from './fixtures';
import { renderInVolto } from '../../testing/render';

const VAR = '--vocabulary-background-color';

describe('SessionAudience', () => {
  it('shows each audience as a pill colored from the event settings', () => {
    const { container } = renderInVolto(
      <SessionAudience item={brainSession} />,
      eventStore,
    );
    const pill = container.querySelector<HTMLElement>('.sessionAudience');
    expect(pill?.style.getPropertyValue(VAR)).toBe('#ff0000');
    expect(container.querySelector('.audience.developers')?.textContent).toBe(
      'Developers',
    );
    expect(
      container.querySelectorAll('.sessionAudiences .sessionAudience'),
    ).toHaveLength(1);
  });

  it('uses "unset" for an audience without a color', () => {
    const { container } = renderInVolto(
      <SessionAudience
        item={{ session_audience: [{ token: 'students', title: 'Students' }] }}
      />,
      eventStore,
    );
    const pill = container.querySelector<HTMLElement>('.sessionAudience');
    expect(pill?.style.getPropertyValue(VAR)).toBe('unset');
  });

  it('renders nothing without an audience', () => {
    const { container } = renderInVolto(
      <SessionAudience item={{ session_audience: [] }} />,
      eventStore,
    );
    expect(container.querySelector('.sessionAudiences')).toBeNull();
  });
});
