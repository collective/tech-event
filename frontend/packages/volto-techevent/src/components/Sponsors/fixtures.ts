import type {
  SponsorBenefit,
  SponsorInfo,
  SponsorLevel,
} from '@plone-collective/volto-techevent/types/sponsors';

export const EVENT_ROOT = 'http://example.org/event';

export const sponsorAcme: SponsorInfo = {
  '@id': `${EVENT_ROOT}/sponsors/acme`,
  '@type': 'Sponsor',
  description: 'Makes everything',
  head_title: '',
  image_field: 'image',
  image_scales: null,
  level: 'gold',
  nav_title: 'Acme',
  review_state: 'published',
  title: 'Acme Corp',
};

export const sponsorBeta: SponsorInfo = {
  '@id': `${EVENT_ROOT}/sponsors/beta`,
  '@type': 'Sponsor',
  description: 'Builds the rest',
  head_title: '',
  image_field: 'image',
  image_scales: null,
  level: 'gold',
  nav_title: 'Beta',
  review_state: 'published',
  title: 'Beta Labs',
};

export const goldLevel: SponsorLevel = {
  '@id': `${EVENT_ROOT}/sponsors/gold`,
  id: 'gold',
  title: 'Gold',
  items: [sponsorAcme, sponsorBeta],
  has_sponsors: true,
  exclude_from_nav: false,
  image_scales: null,
};

export const silverLevel: SponsorLevel = {
  '@id': `${EVENT_ROOT}/sponsors/silver`,
  id: 'silver',
  title: 'Silver',
  items: [],
  has_sponsors: false,
  exclude_from_nav: false,
  image_scales: null,
};

export const benefits: SponsorBenefit[] = [
  {
    id: 'logo',
    title: 'Logo',
    description: 'Logo on the site',
    levels: { gold: '✅' },
  },
  {
    id: 'booth',
    title: 'Booth',
    description: 'A booth at the venue',
    levels: {},
  },
];

/** The store a sponsors view needs: the event root and the sponsors state. */
export const sponsorsStore = {
  content: {
    data: {
      '@components': {
        inherit: {
          'collective.techevent.event_settings': {
            from: { '@id': EVENT_ROOT },
            data: {},
          },
        },
      },
    },
  },
  sponsors: {
    benefits,
    levels: [goldLevel, silverLevel],
    loading: false,
    error: null,
  },
};
