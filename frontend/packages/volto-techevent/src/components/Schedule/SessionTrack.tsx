import React from 'react';
import { useVocabularyColors } from '@plone-collective/volto-techevent/hooks/useVocabularyColors';
import type { Term } from '@plone-collective/volto-techevent/types/common';

interface SessionTrackProps {
  term: Term;
}

const SessionTrack: React.FC<SessionTrackProps> = ({ item }) => {
  const track = item?.session_track?.length > 0 ? item.session_track[0] : null;
  const token = track?.token;
  const title = track?.title;
  const colors = useVocabularyColors('tracks');
  const value = colors?.[token] || 'unset';
  return (
    token && (
      <div
        className="sessionTrack"
        style={{ '--vocabulary-background-color': value }}
      >
        <div className={`track ${token}`}>{title}</div>
      </div>
    )
  );
};

export default SessionTrack;
