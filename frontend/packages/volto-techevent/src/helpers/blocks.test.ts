import { describe, it, expect } from 'vitest';
import type { Content } from '@plone/types';
import { sponsorLevelRestrict } from './blocks';

const item = (type: string) => ({ '@type': type }) as unknown as Content;

describe('sponsorLevelRestrict', () => {
  it('hides SponsorLevel items', () => {
    expect(sponsorLevelRestrict({ properties: item('SponsorLevel') })).toBe(
      false,
    );
  });

  it('allows other content types', () => {
    expect(sponsorLevelRestrict({ properties: item('Sponsor') })).toBe(true);
    expect(sponsorLevelRestrict({ properties: item('Document') })).toBe(true);
  });

  it('allows content without a type', () => {
    expect(sponsorLevelRestrict({ properties: {} as Content })).toBe(true);
  });
});
