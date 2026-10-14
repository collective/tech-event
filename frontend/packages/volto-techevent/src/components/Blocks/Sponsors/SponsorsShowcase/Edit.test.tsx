// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import Edit from './Edit';
import { blockEditProps, registerSponsorBlocks } from '../fixtures';
import { sponsorsStore } from '../../../Sponsors/fixtures';
import { renderInVolto } from '../../../../testing/render';

registerSponsorBlocks();

describe('SponsorsShowcase edit', () => {
  it('renders the block as it looks on the page', () => {
    const { container } = renderInVolto(
      <Edit
        {...blockEditProps({
          type: 'sponsorsShowcaseBlock',
          data: { title: 'Packages' },
        })}
      />,
      sponsorsStore,
    );
    expect(container.querySelector('.sponsors.title')?.textContent).toBe(
      'Packages',
    );
    expect(container.querySelectorAll('.sponsorLevel')).toHaveLength(1);
  });
});
