import { describe, it, expect } from 'vitest';
import { contentIcons } from './icons';

const portalTypes = [
  'Tech Event',
  'Schedule',
  'Slot',
  'Break',
  'Meeting',
  'OpenSpace',
  'Talk',
  'Keynote',
  'Training',
  'LightningTalks',
  'Presenter',
  'Venue',
  'Room',
  'SponsorsDB',
  'SponsorLevel',
  'Sponsor',
];

describe('contentIcons', () => {
  it.each(portalTypes)('has an icon for %s', (portalType) => {
    expect(contentIcons[portalType]).toBeTruthy();
  });
});
