import React from 'react';
import { useIntl } from 'react-intl';
import messages from './messages';

interface RegistrationDeadlineProps {
  closesAt: string | null;
}

/** "Registration closes on <date>.", when the event has a deadline. */
const RegistrationDeadline: React.FC<RegistrationDeadlineProps> = ({
  closesAt,
}) => {
  const intl = useIntl();
  if (!closesAt) return null;
  const date = intl.formatDate(closesAt, {
    dateStyle: 'long',
    timeStyle: 'short',
  });
  return (
    <p className="registration-deadline">
      {intl.formatMessage(messages.closesOn, { date })}
    </p>
  );
};

export default RegistrationDeadline;
