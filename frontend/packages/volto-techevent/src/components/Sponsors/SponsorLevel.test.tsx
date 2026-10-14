// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import SponsorLevel from './SponsorLevel';
import { goldLevel } from './fixtures';
import { renderInVolto } from '../../testing/render';

describe('SponsorLevel', () => {
  it('shows the level title and its sponsors', () => {
    const { container } = renderInVolto(<SponsorLevel item={goldLevel} />);
    expect(container.querySelector('.sponsor_title')?.textContent).toBe('Gold');
    expect(container.querySelectorAll('.sponsorTile')).toHaveLength(2);
  });

  it('uses the given title over the level title', () => {
    const { container } = renderInVolto(
      <SponsorLevel item={goldLevel} title="Our Top Partners" />,
    );
    expect(container.querySelector('.sponsor_title')?.textContent).toBe(
      'Our Top Partners',
    );
  });

  it('aligns the title left by default and follows the styles', () => {
    const { container, unmount } = renderInVolto(
      <SponsorLevel item={goldLevel} />,
    );
    expect(container.querySelector('h3')?.className).toBe('title left');
    unmount();

    const { container: aligned } = renderInVolto(
      <SponsorLevel
        item={goldLevel}
        styles={{ 'align:noprefix': { '--block-alignment': 'align-right' } }}
      />,
    );
    expect(aligned.querySelector('h3')?.className).toBe('title right');
  });
});
