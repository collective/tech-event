import coffeeSVG from '@plone-collective/volto-techevent/icons/coffee.svg';
import meetingSVG from '@plone-collective/volto-techevent/icons/meeting.svg';
import microphoneSVG from '@plone-collective/volto-techevent/icons/microphone.svg';
import trainingSVG from '@plone-collective/volto-techevent/icons/training.svg';
import calendarSVG from '@plone/volto/icons/calendar.svg';
import clockSVG from '@plone/volto/icons/clock.svg';
import eventSVG from '@plone/volto/icons/event.svg';
import lightningTalksSVG from '@plone/volto/icons/fast-forward.svg';
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
