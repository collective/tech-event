import React from 'react';
import { useVocabularyColors } from '@plone-collective/volto-techevent/hooks/useVocabularyColors';
import type { SessionInfo } from '@plone-collective/volto-techevent/types/schedule';
import Icon from '@plone/volto/components/theme/Icon/Icon';
import targetSVG from '@plone/volto/icons/target.svg';
import SessionPill from './SessionPill';

interface SessionAudienceProps {
  item: SessionInfo;
}

const SessionAudience: React.FC<SessionAudienceProps> = ({ item }) => {
  const session_audience =
    item.session_audience?.length > 0 ? item.session_audience : null;
  const colors = useVocabularyColors('audience');
  return (
    session_audience && (
      <div className="sessionAudiences">
        <Icon name={targetSVG} className={'categoryIcon'} />
        {session_audience.map((item, i) => {
          const { token } = item;
          const color = colors?.[token] || 'unset';
          return (
            <SessionPill
              key={i}
              term={item}
              className={'sessionAudience'}
              color={color}
            />
          );
        })}
      </div>
    )
  );
};

export default SessionAudience;
