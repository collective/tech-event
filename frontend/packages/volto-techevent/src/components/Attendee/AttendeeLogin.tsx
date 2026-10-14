import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { usePrevious } from '@plone/volto/helpers/Utils/usePrevious';
import { useHistory } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';

import Helmet from '@plone/volto/helpers/Helmet/Helmet';
import { resetPassword } from '@plone/volto/actions/users/users';
import { Form } from '@plone/volto/components/manage/Form';

const messages = defineMessages({
  title: {
    id: 'box_request_one_time_password',
    defaultMessage: 'Request a one-time password',
  },
  description: {
    id: 'description_request_one_time_password',
    defaultMessage:
      'Enter your email to receive a one-time password for login.',
  },
  default: {
    id: 'Default',
    defaultMessage: 'Default',
  },
  emailTitle: {
    id: 'label_my_email_is',
    defaultMessage: 'My email is',
  },
  sendRequest: {
    id: 'Send request',
    defaultMessage: 'Send request',
  },
  requestSent: {
    id: 'Request sent',
    defaultMessage: 'Request sent',
  },
});

interface UsersState {
  users: {
    reset: {
      loading: boolean;
      loaded: boolean;
      error: string | null;
    };
  };
}

const useUsers = () => {
  const loading = useSelector((state: UsersState) => state.users.reset.loading);
  const loaded = useSelector((state: UsersState) => state.users.reset.loaded);
  const error = useSelector((state: UsersState) => state.users.reset.error);

  return { loading, loaded, error };
};

const RequestOneTimePassword = () => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const [isSuccessful, setisSuccessful] = useState(false);
  const history = useHistory();
  const identifierTitle = useRef<string>();
  const { loaded, loading, error: props_error } = useUsers();
  const prevloading = usePrevious(loading);

  const identifierField = 'email';

  identifierTitle.current = intl.formatMessage(messages.emailTitle);

  useEffect(() => {
    if (prevloading && loaded) setisSuccessful(true);
  }, [prevloading, loaded]);

  // Volto's Form has already rejected an empty email (it is required).
  const onSubmit = (data: { [key: string]: string }) => {
    dispatch(resetPassword(data[identifierField]));
  };

  const onCancel = () => {
    history.goBack();
  };

  if (isSuccessful) {
    return (
      <Container>
        <h1 className="documentFirstHeading">
          <FormattedMessage
            id="heading_request_sent"
            defaultMessage="One-time password sent"
          />
        </h1>
        <p className="description">
          <FormattedMessage
            id="description_request_sent"
            defaultMessage="Please, check your email and log in using your email address and the one-time password you received."
          />
        </p>
        <p>
          <a href="/login">
            <FormattedMessage
              id="continue_to_login"
              defaultMessage="Continue to login"
            />
          </a>
        </p>
      </Container>
    );
  }

  return (
    <div id="page-request-one-time-password">
      <Helmet title={intl.formatMessage(messages.requestSent)} />
      <Container>
        <Form
          title={intl.formatMessage(messages.title)}
          description={intl.formatMessage(messages.description)}
          onSubmit={onSubmit}
          onCancel={onCancel}
          submitLabel={intl.formatMessage(messages.sendRequest)}
          error={props_error}
          schema={{
            fieldsets: [
              {
                id: 'default',
                title: intl.formatMessage(messages.default),
                fields: [identifierField],
              },
            ],
            properties: {
              [identifierField]: {
                type: 'string',
                title: identifierTitle.current,
              },
            },
            required: [identifierField],
          }}
        />
      </Container>
    </div>
  );
};

export default RequestOneTimePassword;
