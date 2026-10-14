import { describe, it, expect, vi } from 'vitest';
import SessionView from './SessionView';
import { eventStore, sessionContent } from './fixtures';
import { renderInVolto } from '../../testing/render';
import type { TrainingInfo } from '@plone-collective/volto-techevent/types/schedule';

// PresenterTile imports a social-media component path that the installed
// package does not provide; these fixtures have no presenters, so a stub is enough.
vi.mock('../Presenter/PresenterTile', () => ({
  default: () => null,
}));

const withText = {
  ...sessionContent,
  text: {
    'content-type': 'text/html',
    data: '<p>Hands-on blocks.</p>',
    encoding: 'utf-8',
  },
};

describe('SessionView', () => {
  it('shows the title, the description and the session details', () => {
    const { container } = renderInVolto(
      <SessionView content={withText} />,
      eventStore,
    );
    expect(container.querySelector('.sessionTitle')?.textContent).toBe(
      'Building with Volto',
    );
    expect(container.querySelector('.sessionDescription')?.textContent).toBe(
      'Blocks, from zero to published.',
    );
    expect(container.querySelector('.sessionText p')?.textContent).toBe(
      'Hands-on blocks.',
    );
  });

  it('shows the video when the session has one', () => {
    const { container } = renderInVolto(
      <SessionView
        content={{
          ...withText,
          session_video: 'https://www.youtube.com/watch?v=abc123',
        }}
      />,
      eventStore,
    );
    expect(container.querySelector('.sessionVideo .video')).not.toBeNull();
    expect(
      container.querySelector('.sessionVideo iframe')?.getAttribute('src'),
    ).toContain('abc123');
  });

  it('shows the requirements of a training', () => {
    const training = {
      ...withText,
      requirements: {
        'content-type': 'text/html',
        data: '<p>Bring a laptop.</p>',
        encoding: 'utf-8',
      },
    } as unknown as TrainingInfo;
    const { container } = renderInVolto(
      <SessionView content={training} />,
      eventStore,
    );
    expect(container.querySelectorAll('.sessionText')).toHaveLength(2);
    expect(container.querySelectorAll('.sessionText')[1].textContent).toBe(
      'Bring a laptop.',
    );
  });

  it('omits the details section when there is no text', () => {
    const { container } = renderInVolto(
      <SessionView content={{ ...sessionContent, text: null }} />,
      eventStore,
    );
    expect(container.querySelector('.sessionText')).toBeNull();
    expect(container.querySelector('.sessionVideo')).toBeNull();
  });
});
