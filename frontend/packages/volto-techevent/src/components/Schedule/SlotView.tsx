import React from 'react';
import { Container } from '@plone/components';
import type { ScheduleInfo } from '@plone-collective/volto-techevent/types/schedule';
import SessionMetadata from '@plone-collective/volto-techevent/components/Schedule/SessionMetadata';

interface SlotViewProps {
  content: ScheduleInfo;
}

/**
 * SlotView view component.
 * @function SlotView
 * @param content - Content object.
 * @returns Markup of the component.
 */
const SlotView: React.FC<SlotViewProps> = ({ content }) => {
  const { title, description } = content;
  const portal_type = content['@type'];
  return (
    <Container
      id="page-document"
      className={`view-wrapper slot-view ${portal_type}`}
    >
      <Container className={'wrapper'}>
        <SessionMetadata item={content} shortDate={false} />
        <Container className={'sessionWrapper'}>
          <Container className="sessionData">
            <Container className="sessionHeader">
              <div className="sessionTitle">{title}</div>
              <div className="sessionDescription">{description}</div>
            </Container>
          </Container>
        </Container>
      </Container>
    </Container>
  );
};

export default SlotView;
