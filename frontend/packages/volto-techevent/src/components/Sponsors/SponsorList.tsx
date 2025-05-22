import React from 'react';
import { Container } from '@plone/components';
import type { SponsorInfo } from '@plone-collective/volto-techevent/types/sponsors';
import SponsorTile from './SponsorTile';

interface SponsorListProps {
  sponsors: SponsorInfo[];
  style: object;
}

const SponsorList: React.FC<SponsorListProps> = ({ sponsors, styles = {} }) => {
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
