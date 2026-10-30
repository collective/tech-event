import React from 'react';
import { useIntl } from 'react-intl';
import messages from './messages';
import type { RegistrationState } from '@plone-collective/volto-techevent/types/registration';

const LABELS = {
  pending: messages.statePending,
  registered: messages.stateRegistered,
  attended: messages.stateAttended,
  cancelled: messages.stateCancelled,
} as const;

interface RegistrationStateLabelProps {
  state: RegistrationState;
}

/** The state of a registration, translated, styled by state. */
const RegistrationStateLabel: React.FC<RegistrationStateLabelProps> = ({
  state,
}) => {
  const intl = useIntl();
  const label = LABELS[state] ? intl.formatMessage(LABELS[state]) : state;
  return (
    <span className={`registration-state registration-state-${state}`}>
      {label}
    </span>
  );
};

export default RegistrationStateLabel;
