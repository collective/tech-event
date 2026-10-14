import React from 'react';
import { useVocabularyColors } from '@plone-collective/volto-techevent/hooks/useVocabularyColors';
import type { TermLike } from './fields';
import Icon from '@plone/volto/components/theme/Icon/Icon';
import levelSVG from '@plone/volto/icons/vertical.svg';
import SessionPill from './SessionPill';

interface SessionLevelProps {
  item: { session_level?: TermLike[] | null };
}

const SessionLevel: React.FC<SessionLevelProps> = ({ item }) => {
  const session_level =
    item.session_level?.length > 0 ? item.session_level : null;
  const colors = useVocabularyColors('levels');
  return (
    session_level && (
      <div className="sessionLevels">
        <Icon name={levelSVG} className={'categoryIcon'} />
        {session_level.map((item, i) => {
          const { token } = item;
          const color = (token && colors?.[token]) || 'unset';
          return (
            <SessionPill
              key={i}
              term={item}
              className={'sessionLevel'}
              color={color}
            />
          );
        })}
      </div>
    )
  );
};

export default SessionLevel;
