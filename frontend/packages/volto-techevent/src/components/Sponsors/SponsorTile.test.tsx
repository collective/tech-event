// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import SponsorTile from './SponsorTile';
import { sponsorAcme } from './fixtures';
import { renderInVolto } from '../../testing/render';

describe('SponsorTile', () => {
  it('links to the sponsor page', () => {
    const { getByRole } = renderInVolto(<SponsorTile item={sponsorAcme} />);
    expect(getByRole('link').getAttribute('href')).toBe(sponsorAcme['@id']);
  });

  it('marks the tile with its level', () => {
    const { container } = renderInVolto(<SponsorTile item={sponsorAcme} />);
    const tile = container.querySelector('.sponsorTile');
    expect(tile?.classList.contains('gold')).toBe(true);
  });

  it('uses the id sent by the API as the tile id', () => {
    const { container } = renderInVolto(
      <SponsorTile item={{ ...sponsorAcme, id: 'acme-tile' }} />,
    );
    expect(container.querySelector('.sponsorTile')?.id).toBe('acme-tile');
  });
});
