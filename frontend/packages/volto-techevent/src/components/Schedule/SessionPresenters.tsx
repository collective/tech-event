import UniversalLink from '@plone/volto/components/manage/UniversalLink/UniversalLink';
import type { BrainSessionInfo } from '@plone-collective/volto-techevent/types/schedule';

interface SessionPresentersProps {
  item: BrainSessionInfo;
}

const SessionPresenters: React.FC<SessionPresentersProps> = ({ item }) => {
  let presenters = [];
  if (item.presenters?.length === 1) {
    presenters = [...item.presenters];
  }
  if (item.presenters?.length > 1) {
    presenters = item.presenters.slice(0, -1);
  }
  return (
    <div className="presenters">
      {presenters.map((presenter, index) => {
        return (
          <span key={presenter['@id']}>
            <UniversalLink href={presenter.path} className={'presenter'}>
              {presenter.title}
            </UniversalLink>
            {presenters.length !== index + 1 && ', '}
          </span>
        );
      })}
      {item.presenters.length > 1 && (
        <span key={item.presenters[item.presenters.length - 1]['@id']}>
          {' & '}
          <UniversalLink
            href={item.presenters[item.presenters.length - 1]['@id']}
            className={'presenter'}
          >
            {item.presenters[item.presenters.length - 1].title}
          </UniversalLink>
        </span>
      )}
    </div>
  );
};

export default SessionPresenters;
