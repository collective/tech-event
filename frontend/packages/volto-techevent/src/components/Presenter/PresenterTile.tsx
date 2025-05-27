import React from 'react';
import SocialNetworks from '@plonegovbr/volto-social-media/components/SocialNetworks/SocialNetworks';
import UniversalLink from '@plone/volto/components/manage/UniversalLink/UniversalLink';
import Image from '@plone/volto/components/theme/Image/Image';
import { flattenToAppURL } from '@plone/volto/helpers/Url/Url';
import DefaultImageSVG from '@plone/volto/components/manage/Blocks/Listing/default-image.svg';
import { Container } from '@plone/components';
import type { Presenter as PresenterContent } from '@plone-collective/volto-techevent/types/presenter';

interface PresenterTileProps {
  item: PresenterContent;
}

/**
 * PresenterTile view component.
 * @function PresenterTile
 * @param content - Content object.
 * @returns Markup of the component.
 */
const PresenterTile: React.FC<PresenterTileProps> = ({ item }) => {
  const hasImage = Boolean(item?.image_scales);
  const { title, social_links } = item;
  const portal_type = item['@type'];

  return (
    <Container className={`presenterTile ${portal_type}`}>
      <Container className="imgWrapper">
        {hasImage ? (
          <Image
            item={item}
            imageField={'image'}
            alt={item.title}
            className={'presenterImage'}
          />
        ) : (
          <Image
            src={DefaultImageSVG}
            alt="Default image"
            className={'presenterImage'}
          />
        )}
      </Container>
      <Container className="presenterTitle">
        <UniversalLink href={flattenToAppURL(item['@id'])} className={'title'}>
          {title}
        </UniversalLink>
      </Container>
      {social_links && (
        <Container className="presenterLinks">
          <SocialNetworks networks={social_links} animate={true} />
        </Container>
      )}
    </Container>
  );
};

export default PresenterTile;
