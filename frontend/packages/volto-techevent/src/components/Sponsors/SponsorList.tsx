import React from 'react';
import { Container } from '@plone/components';
import type { SponsorInfo } from '@plone-collective/volto-techevent/types/sponsors';
import SponsorTile from './SponsorTile';
import type { SponsorsStyles } from './types';

interface SponsorListProps {
  sponsors: SponsorInfo[];
  /** Accepted for the callers that pass it; the list does not render it. */
  className?: string;
  styles?: SponsorsStyles;
}

const SponsorList: React.FC<SponsorListProps> = ({ sponsors }) => {
  return (
    sponsors && (
      <Container className={`sponsorList`}>
        {sponsors.map(function (sponsor, i) {
          return <SponsorTile item={sponsor} key={i} />;
        })}
      </Container>
    )
  );
};

export default SponsorList;
