import React from 'react';
import { Container } from '@plone/components';
import type {
  SessionInfo,
  TrainingInfo,
} from '@plone-collective/volto-techevent/types/schedule';
import SessionMetadata from '@plone-collective/volto-techevent/components/Schedule/SessionMetadata';
import SessionTrack from '@plone-collective/volto-techevent/components/Schedule/SessionTrack';
import SessionAudience from '@plone-collective/volto-techevent/components/Schedule/SessionAudience';
import SessionLevel from '@plone-collective/volto-techevent/components/Schedule/SessionLevel';
import PresenterTile from '../Presenter/PresenterTile';
import messages from '@plone-collective/volto-techevent/messages';
import { useIntl } from 'react-intl';

interface SessionViewProps {
  content: SessionInfo | TrainingInfo;
}

/**
 * SessionView view component.
 * @function SessionView
 * @param content - Content object.
 * @returns Markup of the component.
 */
const SessionView: React.FC<SessionViewProps> = ({ content }) => {
  const { title, description, text, presenters } = content;
  const portal_type = content['@type'];
  const intl = useIntl();

  return (
    <Container
      id="page-document"
      className={`view-wrapper session-view ${portal_type}`}
    >
      <Container className={'wrapper'}>
        <SessionTrack item={content} />
        <SessionMetadata item={content} shortDate={false} />
        <Container className={'sessionWrapper'}>
          <Container className="sessionData">
            <Container className="sessionHeader">
              <div className="sessionTitle">{title}</div>
              <SessionAudience item={content} />
              <SessionLevel item={content} />
              <div className="sessionDescription">{description}</div>
            </Container>

            <Container className="sessionBody">
              <h3>{intl.formatMessage(messages.details)}</h3>
              <div
                className="sessionText"
                dangerouslySetInnerHTML={{ __html: text.data }}
              />
            </Container>

            {content.requirements && (
              <Container className="sessionBody">
                <h3>{intl.formatMessage(messages.requirements)}</h3>
                <div
                  className="sessionText"
                  dangerouslySetInnerHTML={{
                    __html: content.requirements.data,
                  }}
                />
              </Container>
            )}
          </Container>
          <Container className="sessionPresenters">
            {presenters &&
              presenters.map((presenter, i) => (
                <PresenterTile key={i} item={presenter} />
              ))}
          </Container>
        </Container>
      </Container>
    </Container>
  );
};

export default SessionView;
