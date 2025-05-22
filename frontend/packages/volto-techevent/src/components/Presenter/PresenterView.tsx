import React from 'react';
import Image from '@plone/volto/components/theme/Image/Image';
import SocialNetworks from '@plonegovbr/volto-social-media/components/SocialNetworks/SocialNetworks';
import DefaultImageSVG from '@plone/volto/components/manage/Blocks/Listing/default-image.svg';
import { Container } from '@plone/components';
import PresenterCategory from './PresenterCategory';

/**
 * Type definitions for PresenterView content
 */
interface PresenterContent {
  title?: string;
  description?: string;
  text?: {
    data: string;
  };
  image?: any; // Adjust if you have specific typing for image
  image_caption?: string;
  links?: Record<string, string>; // Adjust to match SocialNetworks prop shape
}

interface PresenterViewProps {
  content: PresenterContent;
}

/**
 * PresenterView view component.
 * @function PresenterView
 * @param content - Content object.
 * @returns Markup of the component.
 */
const PresenterView: React.FC<PresenterViewProps> = ({ content }) => {
  const hasImage = Boolean(content?.image);
  const caption = content?.image_caption;
  const { title, description, text, social_links } = content;
  const descriptionLines = description ? description.split('\n') : [];

  return (
    <Container id="page-document" className="view-wrapper presenter-view">
      <Container className={'wrapper'}>
        <h1 className="presenter-name">{title}</h1>
        <Container className="presenter-labels">
          {content.categories &&
            content.categories.map((category, idx) => {
              return <PresenterCategory label={category} key={idx} />;
            })}
        </Container>
        <div className="presenter-preview-image no-filter">
          {hasImage ? (
            <Image
              item={content}
              imageField="image"
              alt={caption}
              title={caption}
              responsive={true}
            />
          ) : (
            <img src={DefaultImageSVG} alt="" />
          )}
        </div>
        {descriptionLines.length > 0 && (
          <Container narrow className="presenterDescription">
            <p className="documentDescription">
              {descriptionLines.map((line, idx) => (
                <React.Fragment key={idx}>
                  <span>{line}</span>
                  <br />
                </React.Fragment>
              ))}
            </p>
          </Container>
        )}

        {text?.data && (
          <Container
            narrow
            className="presenterText"
            dangerouslySetInnerHTML={{ __html: text.data }}
          />
        )}
        {social_links && (
          <Container narrow className="presenterLinks">
            <SocialNetworks networks={social_links} />
          </Container>
        )}
      </Container>
    </Container>
  );
};

export default PresenterView;
