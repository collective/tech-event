import React from 'react';
import SocialNetworks from '@plonegovbr/volto-social-media/components/SocialNetworks/SocialNetworks';
import UniversalLink from '@plone/volto/components/manage/UniversalLink/UniversalLink';
import Image from '@plone/volto/components/theme/Image/Image';
import { flattenToAppURL } from '@plone/volto/helpers/Url/Url';
import DefaultImageSVG from '@plone/volto/components/manage/Blocks/Listing/default-image.svg';
import { Container } from '@plone/components';
import type { PresenterItem } from './types';

// The picture links to the same page as the name, so keep that second link
// out of the tab order and the accessibility tree. UniversalLink forwards
// these props, but its types do not declare them.
const duplicateLinkProps = { tabIndex: -1, 'aria-hidden': true };

interface PresenterTileProps {
  item: PresenterItem;
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
  const href = flattenToAppURL(item['@id']);

  return (
    <Container className={`presenterTile ${portal_type}`}>
      <Container className="imgWrapper">
        <UniversalLink href={href} {...duplicateLinkProps}>
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
        </UniversalLink>
      </Container>
      <Container className="presenterTitle">
        <UniversalLink href={href} className={'title'}>
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
