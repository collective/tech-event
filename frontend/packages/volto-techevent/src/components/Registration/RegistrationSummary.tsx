import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { Button, Message } from 'semantic-ui-react';
import messages from './messages';
import RegistrationStateLabel from './RegistrationStateLabel';
import type { Registration } from '@plone-collective/volto-techevent/types/registration';

const CANCELLABLE = ['pending', 'registered'];

interface RegistrationSummaryProps {
  registration: Registration;
  canCancel?: boolean;
  submitting?: boolean;
  error?: string | null;
  onCancel?: () => void;
}

/** A registration: its code, its state, and a way to cancel it. */
const RegistrationSummary: React.FC<RegistrationSummaryProps> = ({
  registration,
  canCancel = false,
  submitting = false,
  error = null,
  onCancel,
}) => {
  const intl = useIntl();
  const [confirming, setConfirming] = useState(false);
  const { code, state, email_verified } = registration;
  const cancellable = canCancel && onCancel && CANCELLABLE.includes(state);

  return (
    <div className="registration-summary">
      <dl>
        <dt>{intl.formatMessage(messages.yourCode)}</dt>
        <dd className="registration-code">{code}</dd>
        <dt>{intl.formatMessage(messages.status)}</dt>
        <dd>
          <RegistrationStateLabel state={state} />
        </dd>
      </dl>
      {state === 'pending' && (
        <p className="registration-next-step">
          {intl.formatMessage(
            email_verified
              ? messages.awaitingConfirmation
              : messages.checkEmail,
          )}
        </p>
      )}
      {error && <Message error content={error} />}
      {cancellable && !confirming && (
        <Button basic onClick={() => setConfirming(true)} disabled={submitting}>
          {intl.formatMessage(messages.cancelRegistration)}
        </Button>
      )}
      {cancellable && confirming && (
        <div className="registration-cancel-confirm">
          <p>{intl.formatMessage(messages.reallyCancel)}</p>
          <Button
            negative
            disabled={submitting}
            onClick={() => {
              setConfirming(false);
              onCancel();
            }}
          >
            {intl.formatMessage(messages.confirmCancel)}
          </Button>
          <Button basic onClick={() => setConfirming(false)}>
            {intl.formatMessage(messages.keepRegistration)}
          </Button>
        </div>
      )}
    </div>
  );
};

export default RegistrationSummary;
