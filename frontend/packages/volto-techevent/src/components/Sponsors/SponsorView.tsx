import React from 'react';
import Image from '@plone/volto/components/theme/Image/Image';
import SocialNetworks from '@plonegovbr/volto-social-media/components/SocialNetworks/SocialNetworks';
import { Container } from '@plone/components';

/**
 * Type definitions for SponsorView content
 */
interface SponsorContent {
  title?: string;
  description?: string;
  text?: {
    data: string;
  };
  image?: any; // Adjust if you have specific typing for image
  image_caption?: string;
  links?: Record<string, string>; // Adjust to match SocialNetworks prop shape
}

interface SponsorViewProps {
  content: SponsorContent;
}

/**
 * SponsorView view component.
 * @function SponsorView
 * @param content - Content object.
 * @returns Markup of the component.
 */
const SponsorView: React.FC<SponsorViewProps> = ({ content }) => {
  const hasImage = Boolean(content?.image);
  const caption = content?.image_caption;
  const { title, description, text, social_links } = content;
  const descriptionLines = description ? description.split('\n') : [];

  return (
    <Container id="page-document" className="view-wrapper sponsor-view">
      {hasImage ? (
        <div id="sponsorLogo" className="block image align center">
          <Image
            item={content}
            imageField="image"
            alt={caption}
            title={caption}
            responsive={true}
          />
        </div>
      ) : (
        <h1 className="documentFirstHeading">{title}</h1>
      )}

      {descriptionLines.length > 0 && (
        <Container narrow className="sponsorDescription">
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
          className="sponsorText"
          dangerouslySetInnerHTML={{ __html: text.data }}
        />
      )}
      {social_links && (
        <Container narrow className="sponsorLinks">
          <SocialNetworks networks={social_links} />
        </Container>
      )}
    </Container>
  );
};

export default SponsorView;
