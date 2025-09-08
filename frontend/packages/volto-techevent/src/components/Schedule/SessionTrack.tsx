import React from 'react';
import { useVocabularyColors } from '@plone-collective/volto-techevent/hooks/useVocabularyColors';
import type { Term } from '@plone-collective/volto-techevent/types/common';

interface SessionTrackProps {
  term: Term;
}

const SessionTrack: React.FC<SessionTrackProps> = ({ item }) => {
  const colors = useVocabularyColors('tracks');
  const tracks = item?.session_track || [];
  return (
    <>
      {tracks.map((track) => {
        const token = track?.token;
        const title = track?.title;
        const value = colors?.[token] || 'unset';
        return (
          token && (
            <div
              key={token}
              className="sessionTrack"
              style={
                {
                  ['--vocabulary-background-color' as any]: value,
                } as React.CSSProperties
              }
            >
              <div className={`track ${token}`}>{title}</div>
            </div>
          )
        );
      })}
    </>
  );
};

export default SessionTrack;
