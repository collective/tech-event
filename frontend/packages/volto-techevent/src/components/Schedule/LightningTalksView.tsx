import React from 'react';
import { Container } from '@plone/components';
import type { LightningTalksInfo } from '@plone-collective/volto-techevent/types/schedule';
import SessionMetadata from '@plone-collective/volto-techevent/components/Schedule/SessionMetadata';
import SessionMaterials from '@plone-collective/volto-techevent/components/Schedule/SessionMaterials';
import Video from '@plone-collective/volto-techevent/components/Video/Video';
import messages from '@plone-collective/volto-techevent/messages';
import { useIntl } from 'react-intl';

interface LightningTalksViewProps {
  content: LightningTalksInfo;
}

/**
 * LightningTalksView view component.
 * @function LightningTalksView
 * @param content - Content object.
 * @returns Markup of the component.
 */
const LightningTalksView: React.FC<LightningTalksViewProps> = ({ content }) => {
  const { title, description, talks } = content;
  const portal_type = content['@type'];
  const intl = useIntl();

  return (
    <Container
      id="page-document"
      className={`view-wrapper session-view ${portal_type}`}
    >
      <Container className={'wrapper'}>
        <SessionMetadata item={content} shortDate={false} showRoom />
        <Container className={'sessionWrapper'}>
          <Container className="sessionData">
            <Container className="sessionHeader">
              <div className="sessionTitle">{title}</div>
              <div className="sessionDescription">{description}</div>
            </Container>

            {talks?.length > 0 && (
              <Container className="sessionTalks sessionSection">
                <h3>{intl.formatMessage(messages.presentations)}</h3>
                <div className="talksList">
                  {talks.map((talk, index) => (
                    <div key={index} className="sessionTile">
                      <div className="sessionData">
                        <div className={'sessionTitle'}>
                          <span className="title">{talk.title}</span>
                        </div>
                        <div className="sessionBody">
                          <p className={'presenters'}>
                            <span>{talk.presenters}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Container>
            )}

            {content.session_video && (
              <Container className="sessionVideo sessionSection">
                <h3>{intl.formatMessage(messages.video)}</h3>
                <Video url={content.session_video} />
              </Container>
            )}
            {content.items && content.items.length > 0 && (
              <Container className="sessionMaterials sessionSection">
                <h3>{intl.formatMessage(messages.materials)}</h3>
                <SessionMaterials content={content} />
              </Container>
            )}
          </Container>
        </Container>
      </Container>
    </Container>
  );
};

export default LightningTalksView;
