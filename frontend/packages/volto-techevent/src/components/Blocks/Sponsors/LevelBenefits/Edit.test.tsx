// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import Edit from './Edit';
import { blockEditProps, registerSponsorBlocks } from '../fixtures';
import { sponsorsStore } from '../../../Sponsors/fixtures';
import { renderInVolto } from '../../../../testing/render';

registerSponsorBlocks();

describe('LevelBenefits edit', () => {
  it('renders the block as it looks on the page', () => {
    const { container } = renderInVolto(
      <Edit
        {...blockEditProps({
          data: { title: 'Our Packages' },
          content: { benefits: [] },
        })}
      />,
      sponsorsStore,
    );
    expect(container.querySelector('.benefits.title')?.textContent).toBe(
      'Our Packages',
    );
  });
});
