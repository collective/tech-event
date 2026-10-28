import React from 'react';
import Icon from '@plone/volto/components/theme/Icon/Icon';
import roomSVG from '@plone/volto/icons/map.svg';
import type { ScheduleRoom } from '@plone-collective/volto-techevent/types/schedule';

interface ScheduleRoomHeadersProps {
  rooms: ScheduleRoom[];
}

/** The header row of a day: a corner with the room icon, then each room. */
const ScheduleRoomHeaders: React.FC<ScheduleRoomHeadersProps> = ({ rooms }) => (
  <>
    <div
      className="day-header"
      style={{ gridColumn: 'times', gridRow: 'rooms' }}
    >
      <div className="aside-indication">
        <div className="icon-type">
          <Icon name={roomSVG} />
        </div>
      </div>
    </div>
    {rooms.map(([id, label], index) => (
      <div
        className={`room-header ${id} room-${index}`}
        key={id}
        style={{ gridColumn: `room-${index + 1}`, gridRow: 'rooms' }}
      >
        <span className="room-label">{label || id}</span>
      </div>
    ))}
  </>
);

export default ScheduleRoomHeaders;
