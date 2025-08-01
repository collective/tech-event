import React from 'react';
import { Container } from '@plone/components';
import UniversalLink from '@plone/volto/components/manage/UniversalLink/UniversalLink';
import type {
  SessionInfo,
  TrainingInfo,
} from '@plone-collective/volto-techevent/types/schedule';

interface SessionMaterialsProps {
  content: SessionInfo | TrainingInfo;
}

/**
 * SessionMaterials component.
 * @function SessionMaterials
 * @param content - Content object containing session or training information.
 * @returns Markup of the component.
 */
const SessionMaterials: React.FC<SessionMaterialsProps> = ({ content }) => {
  // Only support YouTube links for now
  const { items } = content;
  return (
    items &&
    items.length > 0 && (
      <Container className="session materials">
        <ul className="session-materials-list">
          {items.map((item, index) => {
            const { title } = item;
            return (
              <li key={index} className="session-material-item">
                <UniversalLink item={item} openLinkInNewTab={true}>
                  {title}
                </UniversalLink>
              </li>
            );
          })}
        </ul>
      </Container>
    )
  );
};

export default SessionMaterials;
