import Icon from '@plone/volto/components/theme/Icon/Icon';
import locationSVG from '@plone/volto/icons/map.svg';
import type { RoomField } from './fields';

interface SlotRoomProps {
  item: RoomField;
  className: string;
}

const SlotRoom: React.FC<SlotRoomProps> = ({ item, className }) => {
  const room = item.room?.length > 0 ? item.room[0] : null;
  return (
    room && (
      <div className={`slotRoom ${room.token} ${className || ''}`.trim()}>
        <Icon name={locationSVG} className={'categoryIcon'} />
        <span className={'title'}>{room.title}</span>
      </div>
    )
  );
};

export default SlotRoom;
