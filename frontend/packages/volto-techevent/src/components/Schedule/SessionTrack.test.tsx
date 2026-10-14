import { describe, it, expect } from 'vitest';
import SessionTrack from './SessionTrack';
import { eventStore } from './fixtures';
import { renderInVolto } from '../../testing/render';

const VAR = '--vocabulary-background-color';

describe('SessionTrack', () => {
  it('shows each track with its vocabulary color', () => {
    const { container } = renderInVolto(
      <SessionTrack
        item={{ session_track: [{ token: 'web', title: 'Web' }] }}
      />,
      eventStore,
    );
    const track = container.querySelector<HTMLElement>('.sessionTrack');
    expect(track?.style.getPropertyValue(VAR)).toBe('#0000ff');
    expect(container.querySelector('.track.web')?.textContent).toBe('Web');
  });

  it('falls back to "unset" for a track without a color', () => {
    const { container } = renderInVolto(
      <SessionTrack
        item={{ session_track: [{ token: 'mobile', title: 'Mobile' }] }}
      />,
      eventStore,
    );
    const track = container.querySelector<HTMLElement>('.sessionTrack');
    expect(track?.style.getPropertyValue(VAR)).toBe('unset');
  });

  it('renders nothing when the session has no tracks', () => {
    const { container } = renderInVolto(
      <SessionTrack item={{ session_track: [] }} />,
      eventStore,
    );
    expect(container.querySelectorAll('.sessionTrack')).toHaveLength(0);
  });
});
