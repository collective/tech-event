import React from 'react';
import Image from '@plone/volto/components/theme/Image/Image';
import { Container } from '@plone/components';
import UniversalLink from '@plone/volto/components/manage/UniversalLink/UniversalLink';
import { flattenToAppURL } from '@plone/volto/helpers/Url/Url';
import { SponsorInfo } from '@plone-collective/volto-techevent/types/sponsors';

interface SponsorTileProps {
  item: SponsorInfo;
}

const SponsorTile: React.FC<SponsorTileProps> = ({ item }) => {
  const sponsorId = item.id;
  const level = item.level;
  return (
    <Container id={sponsorId} className={`sponsorTile ${level}`}>
      <UniversalLink href={flattenToAppURL(item['@id'])}>
        <Image
          item={item}
          imageField="image"
          alt={item.description}
          title={item.title}
          responsive={true}
        />
      </UniversalLink>
    </Container>
  );
};

export default SponsorTile;
