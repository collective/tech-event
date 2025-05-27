import React from 'react';
import PresenterTile from '../../Presenter/PresenterTile';

const PresenterGridItem = ({ item }) => {
  return (
    <div className={`card-container presenter`}>
      <div className="item">
        <PresenterTile item={item} />
      </div>
    </div>
  );
};

export default PresenterGridItem;
