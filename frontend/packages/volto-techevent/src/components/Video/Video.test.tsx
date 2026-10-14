import { describe, it, expect } from 'vitest';
import Video from './Video';
import { renderInVolto } from '../../testing/render';

const embedSrc = (container: HTMLElement) =>
  container.querySelector('.video.embed iframe')?.getAttribute('src');

describe('Video', () => {
  it('embeds a watch URL by its video id', () => {
    const { container } = renderInVolto(
      <Video url="https://www.youtube.com/watch?v=abc123" />,
    );
    expect(embedSrc(container)).toContain('/embed/abc123');
  });

  it('embeds a short youtu.be URL by its video id', () => {
    const { container } = renderInVolto(
      <Video url="https://youtu.be/xyz789" />,
    );
    expect(embedSrc(container)).toContain('/embed/xyz789');
  });
});
