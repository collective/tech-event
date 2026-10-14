// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import Edit from './Edit';
import { blockEditProps, registerSponsorBlocks } from '../fixtures';
import { sponsorsStore } from '../../../Sponsors/fixtures';
import { renderInVolto } from '../../../../testing/render';

registerSponsorBlocks();

describe('LevelComparison edit', () => {
  it('renders the block as it looks on the page', () => {
    const { container } = renderInVolto(
      <Edit
        {...blockEditProps({
          type: 'levelComparisonBlock',
          data: { title: 'Our Packages' },
        })}
      />,
      sponsorsStore,
    );
    expect(container.querySelector('.levelComparison.title')?.textContent).toBe(
      'Our Packages',
    );
  });
});
