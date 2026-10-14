import React from 'react';
import type { TermLike } from './fields';

interface SessionPillProps {
  term: TermLike;
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
        style={
          {
            ['--vocabulary-background-color' as any]: color,
          } as React.CSSProperties
        }
      >
        <div className={`audience ${token}`}>{title}</div>
      </div>
    )
  );
};

export default SessionPill;
