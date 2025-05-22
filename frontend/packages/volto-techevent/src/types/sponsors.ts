import type { ImageScales } from './common';

export interface SponsorInfo {
  '@id': string;
  '@type': string;
  description: string;
  head_title: string;
  image_field: string;
  image_scales: Record<string, ImageScales> | null;
  level: string;
  nav_title: string;
  review_state: string;
  title: string;
}

export interface SponsorLevel {
  '@id': string;
  id: string;
  title: string;
  items: SponsorInfo[];
  has_sponsors: boolean;
  exclude_from_nav: boolean;
  image_scales: Record<string, ImageScales> | null;
}

export interface SponsorBenefit {
  id: string;
  title: string;
  description: string;
  levels: Record<string, string> | null;
}

export interface SponsorsLevels {
  '@id': string;
  items: SponsorLevel[];
  benefits: SponsorBenefit[];
}
