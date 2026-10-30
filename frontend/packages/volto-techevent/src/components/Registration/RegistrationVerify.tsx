import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Container, Message } from 'semantic-ui-react';
import Helmet from '@plone/volto/helpers/Helmet/Helmet';
import { verifyRegistration } from '@plone-collective/volto-techevent/actions/registration/registration';
import type { RegistrationReducerState } from '@plone-collective/volto-techevent/reducers/registration/registration';
import {
  VERIFY_ROUTE,
  contextFromPath,
} from '@plone-collective/volto-techevent/helpers/registration';
import messages from './messages';
import RegistrationSummary from './RegistrationSummary';

/** The target of the emailed link: verifies the registrant's email. */
const RegistrationVerify: React.FC = () => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const location = useLocation();
  const token = new URLSearchParams(location.search).get('token') ?? '';
  const eventRoot = contextFromPath(location.pathname, VERIFY_ROUTE);
  const { loading, result, error } = useSelector(
    (state: { registration: RegistrationReducerState }) =>
      state.registration.verify,
  );

  useEffect(() => {
    if (token) {
      dispatch(verifyRegistration(eventRoot, token));
    }
  }, [dispatch, eventRoot, token]);

  const title = intl.formatMessage(messages.verifyTitle);
  return (
    <Container id="page-registration-verify">
      <Helmet title={title} />
      <h1 className="documentFirstHeading">{title}</h1>
      {!token && (
        <Message error content={intl.formatMessage(messages.missingToken)} />
      )}
      {token && loading && <p>{intl.formatMessage(messages.verifying)}</p>}
      {token && error && <Message error content={error} />}
      {token && result && (
        <>
          <Message success content={intl.formatMessage(messages.verified)} />
          <RegistrationSummary registration={result} />
        </>
      )}
    </Container>
  );
};

export default RegistrationVerify;
