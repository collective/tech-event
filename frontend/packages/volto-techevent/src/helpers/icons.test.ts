import { describe, it, expect } from 'vitest';
import coffeeSVG from '@plone-collective/volto-techevent/icons/coffee.svg';
import lunchSVG from '@plone-collective/volto-techevent/icons/lunch.svg';
import meetingSVG from '@plone-collective/volto-techevent/icons/meeting.svg';
import microphoneSVG from '@plone-collective/volto-techevent/icons/microphone.svg';
import clockSVG from '@plone/volto/icons/clock.svg';
import { contentIcons, getSlotIcon } from './icons';

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
  'Attendees',
  'Attendee',
  'Ticket',
];

describe('contentIcons', () => {
  it.each(portalTypes)('has an icon for %s', (portalType) => {
    expect(contentIcons[portalType]).toBeTruthy();
  });
});

describe('getSlotIcon', () => {
  it('does not use the coffee-break icon for a generic slot', () => {
    const icon = getSlotIcon({ '@type': 'Slot', slot_category: 'slot' });
    expect(icon).toBe(clockSVG);
    expect(icon).not.toBe(coffeeSVG);
  });

  it('uses the meeting icon for a slot in the meeting category', () => {
    expect(getSlotIcon({ '@type': 'Slot', slot_category: 'meeting' })).toBe(
      meetingSVG,
    );
  });

  it('uses the meeting icon for a Meeting', () => {
    expect(getSlotIcon({ '@type': 'Meeting', slot_category: 'slot' })).toBe(
      meetingSVG,
    );
  });

  it('uses the category icon of a break', () => {
    expect(getSlotIcon({ '@type': 'Break', slot_category: 'lunch' })).toBe(
      lunchSVG,
    );
    expect(
      getSlotIcon({ '@type': 'Break', slot_category: 'coffee-break' }),
    ).toBe(coffeeSVG);
  });

  it('uses the icon of the type for a session', () => {
    expect(getSlotIcon({ '@type': 'Talk', slot_category: 'activity' })).toBe(
      microphoneSVG,
    );
  });

  it('falls back to the slot icon for an unknown type', () => {
    expect(getSlotIcon({ '@type': 'Unknown' })).toBe(clockSVG);
    expect(getSlotIcon({})).toBe(clockSVG);
  });
});
