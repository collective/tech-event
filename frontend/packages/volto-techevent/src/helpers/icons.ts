import beerSVG from '@plone-collective/volto-techevent/icons/beer.svg';
import coffeeSVG from '@plone-collective/volto-techevent/icons/coffee.svg';
import lunchSVG from '@plone-collective/volto-techevent/icons/lunch.svg';
import meetingSVG from '@plone-collective/volto-techevent/icons/meeting.svg';
import microphoneSVG from '@plone-collective/volto-techevent/icons/microphone.svg';
import trainingSVG from '@plone-collective/volto-techevent/icons/training.svg';
import calendarSVG from '@plone/volto/icons/calendar.svg';
import cameraSVG from '@plone/volto/icons/camera.svg';
import clockSVG from '@plone/volto/icons/clock.svg';
import eventSVG from '@plone/volto/icons/event.svg';
import lightningTalksSVG from '@plone/volto/icons/fast-forward.svg';
import registrationSVG from '@plone/volto/icons/finger-print.svg';
import heartSVG from '@plone/volto/icons/heart.svg';
import homeSVG from '@plone/volto/icons/home.svg';
import mapSVG from '@plone/volto/icons/map.svg';
import showcaseSVG from '@plone/volto/icons/showcase.svg';
import keynoteSVG from '@plone/volto/icons/star.svg';
import trophySVG from '@plone/volto/icons/trophy.svg';
import userSVG from '@plone/volto/icons/user.svg';

/** Icon of each content type of the add-on, keyed by portal type. */
export const contentIcons: Record<string, string> = {
  'Tech Event': eventSVG,
  Schedule: calendarSVG,
  Slot: clockSVG,
  Break: coffeeSVG,
  Meeting: meetingSVG,
  OpenSpace: meetingSVG,
  Talk: microphoneSVG,
  Keynote: keynoteSVG,
  Training: trainingSVG,
  LightningTalks: lightningTalksSVG,
  Presenter: userSVG,
  Venue: homeSVG,
  Room: mapSVG,
  SponsorsDB: showcaseSVG,
  SponsorLevel: trophySVG,
  Sponsor: heartSVG,
};

/**
 * Icon of the slot categories that mean more than their content type.
 *
 * The generic categories (`slot`, `activity`) are left out on purpose: those
 * slots show the icon of their type.
 */
export const slotCategoryIcons: Record<string, string> = {
  registration: registrationSVG,
  meeting: meetingSVG,
  photo: cameraSVG,
  'coffee-break': coffeeSVG,
  lunch: lunchSVG,
  party: beerSVG,
};

interface IconSlot {
  '@type'?: string;
  slot_category?: string | null;
}

/** Icon for a schedule slot: its category first, then its type. */
export function getSlotIcon(slot: IconSlot): string {
  const category = slot.slot_category;
  if (category && slotCategoryIcons[category]) {
    return slotCategoryIcons[category];
  }
  return contentIcons[slot['@type'] ?? ''] ?? contentIcons.Slot;
}
