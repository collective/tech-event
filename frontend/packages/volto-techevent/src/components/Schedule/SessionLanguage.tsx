import type { SessionInfo } from '@plone-collective/volto-techevent/types/schedule';

interface SessionLanguageProps {
  item: SessionInfo;
  className?: string;
}

const SessionLanguage: React.FC<SessionLanguageProps> = ({
  item,
  className,
}) => {
  const language = Array.isArray(item.session_language)
    ? item.session_language[0]
    : item.session_language;
  const token = language?.token || language;

  return (
    language && (
      <div className={`sessionLanguage ${token} ${className || ''}`.trim()}>
        <span className="token">{token}</span>
      </div>
    )
  );
};

export default SessionLanguage;
