import type { LanguageField } from './fields';

interface SessionLanguageProps {
  item: LanguageField;
  className?: string;
}

const SessionLanguage: React.FC<SessionLanguageProps> = ({
  item,
  className,
}) => {
  const language = Array.isArray(item.session_language)
    ? item.session_language[0]
    : item.session_language;
  const token = typeof language === 'string' ? language : language?.token;

  return (
    language && (
      <div className={`sessionLanguage ${token} ${className || ''}`.trim()}>
        <span className="token">{token}</span>
      </div>
    )
  );
};

export default SessionLanguage;
