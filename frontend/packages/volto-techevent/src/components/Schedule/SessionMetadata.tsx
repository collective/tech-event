import SlotDate from '@plone-collective/volto-techevent/components/Schedule/SlotDate';
import SessionLanguage from '@plone-collective/volto-techevent/components/Schedule/SessionLanguage';
import SlotRoom from '@plone-collective/volto-techevent/components/Schedule/SlotRoom';
import type { BrainSessionInfo } from '@plone-collective/volto-techevent/types/schedule';

interface SessionMetadataProps {
  item: BrainSessionInfo;
  showRoom: boolean;
  shortDate: boolean;
}

const SessionMetadata: React.FC<SessionMetadataProps> = ({
  item,
  showRoom = true,
  shortDate = false,
}) => {
  return (
    <div className="sessionInfo">
      <SlotDate
        item={item}
        shortFormat={shortDate}
        locale={'pt'}
        className={'sessionInfoItem'}
      />
      {showRoom && <SlotRoom item={item} className={'sessionInfoItem'} />}
      <SessionLanguage item={item} className={'sessionInfoItem'} />
    </div>
  );
};

export default SessionMetadata;
