import React from 'react';
import SocialNetworks from '@plonegovbr/volto-social-media/components/SocialNetworks/SocialNetworks';
import DefaultImageSVG from '@plone/volto/components/manage/Blocks/Listing/default-image.svg';
import { Container } from '@plone/components';
import type { Presenter as PresenterContent } from '@plone-collective/volto-techevent/types/presenter';
import PresenterCategory from './PresenterCategory';
import PresenterActivities from './PresenterActivities';
import Card from '../primitives/Card/Card';

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
  const imgProps = hasImage
    ? { item: { ...content, image_field: 'image' } }
    : { src: DefaultImageSVG };
  const { title, description, text, social_links, activities } = content;
  const descriptionLines = description ? description.split('\n') : [];

  return (
    <Container id="page-document" className="view-wrapper presenter-view">
      <Container className={'wrapper has--align--left'}>
        <Card className="profile">
          <Card.Image {...imgProps} />
          <Card.Summary>
            <Container className="presenter-labels">
              {content.categories &&
                content.categories.map((category, idx) => {
                  return <PresenterCategory label={category} key={idx} />;
                })}
            </Container>
            <h2 className="presenter-name">{title}</h2>

            {descriptionLines.length > 0 && (
              <Container className="presenterDescription">
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
                className="presenterText"
                dangerouslySetInnerHTML={{ __html: text.data }}
              />
            )}
            {social_links && (
              <Container className="presenterLinks">
                <SocialNetworks networks={social_links} />
              </Container>
            )}
          </Card.Summary>
        </Card>
        {activities && activities?.length > 0 && (
          <Container className="presenterActivities">
            <PresenterActivities activities={activities} />
          </Container>
        )}
      </Container>
    </Container>
  );
};

export default PresenterView;
