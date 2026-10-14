// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import Edit from './Edit';
import { blockEditProps, registerSponsorBlocks } from '../fixtures';
import { sponsorsStore } from '../../../Sponsors/fixtures';
import { renderInVolto } from '../../../../testing/render';

registerSponsorBlocks();

describe('SponsorLevel edit', () => {
  it('renders the block as it looks on the page', () => {
    const { container } = renderInVolto(
      <Edit
        {...blockEditProps({
          type: 'sponsorLevelBlock',
          data: { title: 'Our Top Partners' },
          content: { id: 'gold' },
        })}
      />,
      sponsorsStore,
    );
    expect(container.querySelectorAll('.sponsorTile')).toHaveLength(2);
    expect(
      container.querySelector('.sponsorLevelBlock .title')?.textContent,
    ).toBe('Our Top Partners');
  });
});
