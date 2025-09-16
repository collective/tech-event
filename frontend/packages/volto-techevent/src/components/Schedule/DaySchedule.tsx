import React from 'react';
import { formatHour } from '@plone-collective/volto-techevent/helpers/date';
import Icon from '@plone/volto/components/theme/Icon/Icon';
import SessionTile from './SessionTile';
import SlotTile from './SlotTile';
import lunchSVG from '@plone-collective/volto-techevent/icons/lunch.svg';
import microphoneSVG from '@plone-collective/volto-techevent/icons/microphone.svg';
import trainingSVG from '@plone-collective/volto-techevent/icons/training.svg';
import coffeeSVG from '@plone-collective/volto-techevent/icons/coffee.svg';
import beerSVG from '@plone-collective/volto-techevent/icons/beer.svg';
import meetingSVG from '@plone-collective/volto-techevent/icons/meeting.svg';
import keynoteSVG from '@plone/volto/icons/star.svg';
import registrationSVG from '@plone/volto/icons/finger-print.svg';
import roomSVG from '@plone/volto/icons/map.svg';
import lightingTalksSVG from '@plone/volto/icons/fast-forward.svg';
import cameraSVG from '@plone/volto/icons/camera.svg';

const iconDict = {
  registration: registrationSVG,
  Slot: coffeeSVG,
  Break: coffeeSVG,
  photo: cameraSVG,
  lunch: lunchSVG,
  party: beerSVG,
  Meeting: meetingSVG,
  OpenSpace: meetingSVG,
  LightningTalks: lightingTalksSVG,
  Training: trainingSVG,
  Talk: microphoneSVG,
  Keynote: keynoteSVG,
};

function nextTimeSlot(t: string): string {
  // Get the next time slot (15 min increments)
  let h = parseInt(t.slice(0, 2), 10);
  let m = parseInt(t.slice(2, 4), 10) + 15;
  if (m >= 60) {
    h += 1;
    m -= 60;
  }
  // Pad hours and minutes with leading zeros
  return h.toString().padStart(2, '0') + m.toString().padStart(2, '0');
}

function getGridRowsAndColumns(slots: any[]) {
  // Get all unique grid rows and columns
  const gridRows = new Set<string>();
  const gridColumnsSet = new Set<string>();
  slots.forEach(({ gridRow = '', gridColumn = '' }) => {
    gridRow.split('/').forEach((label) => gridRows.add(label.trim()));
    gridColumn.split('/').forEach((label) => gridColumnsSet.add(label.trim()));
  });
  // Sort gridColumns
  const gridColumns = Array.from(gridColumnsSet)
    .filter((label: string) => /^room-\d+$/.test(label))
    .sort(
      (a: string, b: string) =>
        parseInt(a.split('-')[1], 10) - parseInt(b.split('-')[1], 10),
    );
  return { gridRows, gridColumns };
}

function buildContinuousGridRows(gridRows: Set<string>): string[] {
  // Ensure continuous gridRows with fixed time increment
  const allTimes = Array.from(gridRows).map(
    (label: string) => label.match(/time-(\d{4})/)[1],
  );
  let allGridRows: string[] = [];
  if (allTimes.length > 0) {
    let t = allTimes[0];
    const end = allTimes[allTimes.length - 1];
    while (t <= end) {
      allGridRows.push(`time-${t}`);
      t = nextTimeSlot(t);
    }
  }
  return allGridRows;
}

const DaySchedule = (props) => {
  const { day } = props;
  const keyDay = day['id'];
  const slots = day.items;
  const hasAllRoom = day.rooms.map((room) => room[0]).includes('_all_');
  const dayRooms = hasAllRoom
    ? day.rooms.filter((room) => room[0] !== '_all_')
    : day.rooms;
  const lenRooms = dayRooms.length;

  // Memoize grid calculations based on slots
  const { gridTemplateRows, gridTemplateColumns } = React.useMemo(() => {
    const { gridRows, gridColumns } = getGridRowsAndColumns(slots);
    const allGridRows = buildContinuousGridRows(gridRows);
    return {
      gridTemplateRows: [
        '[rooms] auto',
        ...allGridRows.map((row) => `[${row}] auto`),
      ].join('\n'),
      gridTemplateColumns:
        '[times] 5rem ' +
        gridColumns.map((column: string) => `[${column}] 1fr`).join(' ') +
        ' [room-all]',
    };
  }, [slots]);

  return (
    <div
      className={`tab-content ${keyDay} rooms rooms-${lenRooms}`}
      style={{
        gridTemplateRows,
        gridTemplateColumns,
      }}
    >
      <div
        className={`day-header`}
        style={{
          gridColumn: 'times',
          gridRow: 'rooms',
        }}
      >
        <div className="aside-indication">
          <div className="icon-type">
            <Icon name={roomSVG} />
          </div>
        </div>
      </div>
      {dayRooms.map((room, roomIndex) => {
        const roomId = room[0];
        const roomLabel = room[1] || roomId;
        return (
          <div
            className={`room-header ${roomId} room-${roomIndex}`}
            key={roomIndex}
            style={{ gridColumn: `room-${roomIndex + 1}`, gridRow: 'rooms' }}
          >
            <span className="room-label">{roomLabel}</span>
          </div>
        );
      })}
      {(() => {
        const finalSlots = [];
        slots.forEach((slot, slotIndex) => {
          if (slot.gridColumn?.startsWith('room-1')) {
            const slot_category =
              slot.slot_category && slot.slot_category !== 'activity'
                ? slot.slot_category
                : slot['@type'];
            finalSlots.push({
              '@type': 'aside',
              start: slot.start,
              icon: iconDict[slot_category] || iconDict['Slot'],
              gridColumn: 'times',
              gridRow: slot.gridRow.split('/')[0].trim(),
            });
          }
          finalSlots.push(slot);
        });
        return finalSlots.map((slot, slotIndex) => {
          if (slot['@type'] === 'aside') {
            const time = new Date(slot.start);
            return (
              <div
                className={`row-header`}
                key={slotIndex}
                style={{
                  gridColumn: 'times',
                  gridRow: slot.gridRow,
                }}
              >
                <div className="aside-indication">
                  <div className="icon-type">
                    <Icon name={slot.icon} />
                  </div>
                  <div className="time-indication">{formatHour(time)}</div>
                </div>
              </div>
            );
          } else {
            const isSession = slot?.['@type'] !== 'Slot';
            const Tile = slot && isSession ? SessionTile : SlotTile;
            const rooms = slot.gridColumn.match('room-all')
              ? 'room-all'
              : slot.gridColumn
                  .split('/')
                  .map((room: string) => room.trim())
                  .join(' ');
            return (
              <div
                className={`timeslot ${rooms} rows-${slot.gridHeight}`}
                style={{
                  gridColumn: slot.gridColumn,
                  gridRow: slot.gridRow,
                }}
                key={slotIndex}
              >
                <div
                  className={`timeslot-container timeslot-${isSession ? 'session' : 'slot'}`}
                >
                  <Tile
                    item={slot}
                    shortDate
                    showRoom={true}
                    showDescription={true}
                    gridColumn={slot.gridColumn}
                    gridRow={slot.gridRow}
                  />
                </div>
              </div>
            );
          }
        });
      })()}
    </div>
  );
};

export default DaySchedule;
