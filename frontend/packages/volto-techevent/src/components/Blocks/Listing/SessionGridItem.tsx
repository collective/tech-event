import React from 'react';
import SessionTile from '../../Schedule/SessionTile';

const SessionGridItem = ({ item }) => {
  return (
    <div className={`card-container session`}>
      <div className="item">
        <SessionTile item={item} showDescription showLevel showAudience />
      </div>
    </div>
  );
};

export default SessionGridItem;
