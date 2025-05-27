import React from 'react';
import type { Term } from '@plone-collective/volto-techevent/types/common';

interface SessionPillProps {
  term: Term;
  className: string;
  color: string;
}

const SessionPill: React.FC<SessionPillProps> = ({
  term,
  className,
  color,
}) => {
  const { token, title } = term;
  return (
    term && (
      <div
        className={className}
        style={{ '--vocabulary-background-color': color }}
      >
        <div className={`audience ${token}`}>{title}</div>
      </div>
    )
  );
};

export default SessionPill;
