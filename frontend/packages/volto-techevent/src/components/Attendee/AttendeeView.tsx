import React from 'react';
import { useIntl } from 'react-intl';
import { Container } from 'semantic-ui-react';
import messages from '@plone-collective/volto-techevent/components/Registration/messages';
import RegistrationStateLabel from '@plone-collective/volto-techevent/components/Registration/RegistrationStateLabel';
import type { RegistrationState } from '@plone-collective/volto-techevent/types/registration';

interface AttendeeContent {
  id: string;
  title: string;
  email?: string;
  email_verified?: boolean;
  review_state?: RegistrationState;
}

interface AttendeeViewProps {
  content: AttendeeContent;
}

/**
 * A registration, for its registrant and the organizers: the name, the
 * registration code, the email address and the state.
 */
const AttendeeView: React.FC<AttendeeViewProps> = ({ content }) => {
  const intl = useIntl();
  const { id, title, email, email_verified, review_state } = content;
  return (
    <Container id="page-attendee" className="view-wrapper attendee-view">
      <h1 className="documentFirstHeading">{title}</h1>
      <div className="registration-summary">
        <dl>
          <dt>{intl.formatMessage(messages.registrationCode)}</dt>
          <dd className="registration-code">{id}</dd>
          {review_state && (
            <>
              <dt>{intl.formatMessage(messages.status)}</dt>
              <dd>
                <RegistrationStateLabel state={review_state} />
              </dd>
            </>
          )}
          {email && (
            <>
              <dt>{intl.formatMessage(messages.email)}</dt>
              <dd className="attendee-email">
                {email}{' '}
                <span className="attendee-email-status">
                  (
                  {intl.formatMessage(
                    email_verified
                      ? messages.emailConfirmed
                      : messages.emailNotConfirmed,
                  )}
                  )
                </span>
              </dd>
            </>
          )}
        </dl>
      </div>
    </Container>
  );
};

export default AttendeeView;
