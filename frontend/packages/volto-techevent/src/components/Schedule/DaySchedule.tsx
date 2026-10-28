import React from 'react';
import {
  buildTimeline,
  getDayRooms,
  getGridTemplate,
} from '@plone-collective/volto-techevent/helpers/schedule';
import type { DaySchedule as DayScheduleData } from '@plone-collective/volto-techevent/types/schedule';
import ScheduleRoomHeaders from './ScheduleRoomHeaders';
import ScheduleTimeHeader from './ScheduleTimeHeader';
import ScheduleTimeslot from './ScheduleTimeslot';

interface DayScheduleProps {
  day: DayScheduleData;
}

/** One day of the schedule, laid out as a grid of rooms by 15 minute rows. */
const DaySchedule: React.FC<DayScheduleProps> = ({ day }) => {
  const slots = day.items;
  const rooms = getDayRooms(day.rooms);
  const gridTemplate = React.useMemo(() => getGridTemplate(slots), [slots]);
  const timeline = React.useMemo(() => buildTimeline(slots), [slots]);

  return (
    <div
      className={`tab-content ${day.id} rooms rooms-${rooms.length}`}
      style={gridTemplate}
    >
      <ScheduleRoomHeaders rooms={rooms} />
      {timeline.map((entry, index) =>
        entry.kind === 'time' ? (
          <ScheduleTimeHeader key={index} entry={entry} />
        ) : (
          <ScheduleTimeslot key={index} slot={entry.slot} />
        ),
      )}
    </div>
  );
};

export default DaySchedule;
