import React from 'react';
import {
  getSlotRoomsClass,
  isSessionSlot,
} from '@plone-collective/volto-techevent/helpers/schedule';
import type { ScheduleSlot } from '@plone-collective/volto-techevent/types/schedule';
import SessionTile from './SessionTile';
import SlotTile from './SlotTile';

interface ScheduleTimeslotProps {
  slot: ScheduleSlot;
}

/** The grid cell of one slot, holding a session or a slot tile. */
const ScheduleTimeslot: React.FC<ScheduleTimeslotProps> = ({ slot }) => {
  const isSession = isSessionSlot(slot);
  const Tile = isSession ? SessionTile : SlotTile;
  return (
    <div
      className={`timeslot ${getSlotRoomsClass(slot.gridColumn)} rows-${slot.gridHeight}`}
      style={{ gridColumn: slot.gridColumn, gridRow: slot.gridRow }}
    >
      <div
        className={`timeslot-container timeslot-${isSession ? 'session' : 'slot'}`}
      >
        <Tile item={slot} shortDate showDescription={true} />
      </div>
    </div>
  );
};

export default ScheduleTimeslot;
