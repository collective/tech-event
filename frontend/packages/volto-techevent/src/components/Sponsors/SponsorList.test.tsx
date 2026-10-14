// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import SponsorList from './SponsorList';
import { goldLevel, sponsorAcme, sponsorBeta } from './fixtures';
import { renderInVolto } from '../../testing/render';

describe('SponsorList', () => {
  it('renders one tile per sponsor, in order', () => {
    const { container } = renderInVolto(
      <SponsorList sponsors={goldLevel.items} />,
    );
    const hrefs = Array.from(
      container.querySelectorAll('.sponsorTile-link'),
    ).map((link) => link.getAttribute('href'));
    expect(hrefs).toEqual([sponsorAcme['@id'], sponsorBeta['@id']]);
  });

  it('renders the list container with no tiles when there are no sponsors', () => {
    const { container } = renderInVolto(<SponsorList sponsors={[]} />);
    expect(container.querySelector('.sponsorList')).not.toBeNull();
    expect(container.querySelectorAll('.sponsorTile')).toHaveLength(0);
  });
});
