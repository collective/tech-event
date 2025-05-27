import SlotDate from '@plone-collective/volto-techevent/components/Schedule/SlotDate';
import SessionLanguage from '@plone-collective/volto-techevent/components/Schedule/SessionLanguage';
import SlotRoom from '@plone-collective/volto-techevent/components/Schedule/SlotRoom';

const SessionMetadata = ({ item, shortDate }) => {
  return (
    <div className="sessionInfo">
      <SlotDate
        item={item}
        shortFormat={shortDate}
        locale={'pt'}
        className={'sessionInfoItem'}
      />
      <SlotRoom item={item} className={'sessionInfoItem'} />
      <SessionLanguage item={item} className={'sessionInfoItem'} />
    </div>
  );
};

export default SessionMetadata;
