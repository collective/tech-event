import React from 'react';
import { Container } from '@plone/components';
import SlotDate from '@plone-collective/volto-techevent/components/Schedule/SlotDate';
import type { BrainSessionInfo } from '@plone-collective/volto-techevent/types/schedule';

interface SlotTileProps {
  item: BrainSessionInfo;
  showDescription: boolean;
  showAudience: boolean;
  showLevel: boolean;
  shortDate: boolean;
}

const SlotTile: React.FC<SlotTileProps> = ({
  item,
  showDescription = true,
  shortDate = true,
}) => {
  const uid = item.UID;
  const type = item['@type'];

  return (
    <Container className={`slotTile ${type} ${uid}`}>
      <SlotDate
        item={item}
        shortFormat={shortDate}
        locale={'pt'}
        className={'sessionInfoItem'}
      />
      <Container className="slotData">
        <Container className="slotHeader">
          <div className="slotTitle">{item.title}</div>
          {showDescription && (
            <div className="slotDescription">{item.description}</div>
          )}
        </Container>
      </Container>
    </Container>
  );
};

export default SlotTile;
