import { describe, it, expect } from 'vitest';
import SessionMetadata from './SessionMetadata';
import { sessionContent } from './fixtures';
import { renderInVolto } from '../../testing/render';

describe('SessionMetadata', () => {
  it('shows the time, the room and the language', () => {
    const { container } = renderInVolto(
      <SessionMetadata item={sessionContent} shortDate={false} />,
    );
    expect(container.querySelector('.sessionInfo .slotDate')).not.toBeNull();
    expect(container.querySelector('.slotRoom .title')?.textContent).toBe(
      'Room A',
    );
    expect(
      container.querySelector('.sessionLanguage .token')?.textContent,
    ).toBe('en');
  });

  it('hides the room when showRoom is false', () => {
    const { container } = renderInVolto(
      <SessionMetadata item={sessionContent} shortDate showRoom={false} />,
    );
    expect(container.querySelector('.slotRoom')).toBeNull();
    expect(container.querySelector('.sessionLanguage')).not.toBeNull();
  });
});
