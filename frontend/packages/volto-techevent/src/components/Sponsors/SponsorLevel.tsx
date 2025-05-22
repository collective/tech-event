import React from 'react';
import { Container } from '@plone/components';
import type { SponsorLevel as SponsorLevelType } from '@plone-collective/volto-techevent/types/sponsors';
import SponsorList from './SponsorList';
import { extractAlignment } from '@plone-collective/volto-techevent/helpers/styles';

interface SponsorLevelProps {
  item: SponsorLevelType;
  style: object;
  title: string;
}

const SponsorLevel: React.FC<SponsorLevelProps> = ({
  item,
  styles = {},
  title = '',
}) => {
  const levelId = item.id;
  const title_ = title && title !== '' ? title : item.title;
  const sponsors = item.items;
  const align = extractAlignment(styles);

  return (
    sponsors && (
      <Container className={`sponsorLevel ${levelId}`}>
        <h3 className={`title ${align}`}>
          <span className="sponsor_title">{title_}</span>
        </h3>
        <SponsorList className={`${levelId}`} sponsors={sponsors} />
      </Container>
    )
  );
};

export default SponsorLevel;
