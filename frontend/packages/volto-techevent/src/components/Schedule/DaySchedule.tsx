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

const DaySchedule = (props) => {
  const { day } = props;
  const keyDay = day['id'];
  const hours = day.items;
  const hasAllRoom = day.rooms.map((room) => room[0]).includes('_all_');
  const dayRooms = hasAllRoom
    ? day.rooms.filter((room) => room[0] !== '_all_')
    : day.rooms;
  const lenRooms = dayRooms.length;
  return (
    <div className={`tab-content ${keyDay}`}>
      <div className={`day-header`}>
        <div className="aside-indication">
          <div className="icon-type">
            <Icon name={roomSVG} />
          </div>
        </div>
        <div className={`rooms rooms-${lenRooms}`}>
          {dayRooms.map((room, roomIndex) => {
            const roomId = room[0];
            const roomLabel = room[1] || roomId;
            return (
              <div
                className={`room ${roomId} room-${roomIndex}`}
                key={roomIndex}
              >
                <span className="room-label">{roomLabel}</span>
              </div>
            );
          })}
        </div>
      </div>
      {hours.map((hour, hourIndex) => {
        const time = new Date(hour['id']);
        const rooms = hour['items'];
        const slotType = hour['types'] ? hour.types[0] : 'Talk';
        const icon = iconDict[slotType] || iconDict['Slot'];
        return (
          <div className={`timeslot`} key={hourIndex}>
            <div className="aside-indication">
              <div className="icon-type">
                <Icon name={icon} />
              </div>
              <div className="time-indication">{formatHour(time)}</div>
            </div>
            <div className={`rooms rooms-${lenRooms}`}>
              {hasAllRoom && rooms['_all_'] ? (
                <div className={'room-all'}>
                  <SlotTile item={rooms['_all_']} />
                </div>
              ) : (
                dayRooms.map((room, roomIndex) => {
                  const roomId = room[0];
                  const slot = rooms?.[roomId];
                  const isSession = slot?.['@type'] !== 'Slot';
                  const Tile = slot && isSession ? SessionTile : SlotTile;
                  return (
                    <div
                      className={`room ${roomId} room-${roomIndex}`}
                      key={roomIndex}
                    >
                      {slot ? (
                        <Tile
                          item={slot}
                          shortDate
                          showRoom={false}
                          showDescription={true}
                        />
                      ) : (
                        <div className="slot-card empty">{''}</div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DaySchedule;
