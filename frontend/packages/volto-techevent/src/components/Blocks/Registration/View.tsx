import React, { useState } from 'react';
import cx from 'classnames';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { Button, Message } from 'semantic-ui-react';
import { Container } from '@plone/components';
import UniversalLink from '@plone/volto/components/manage/UniversalLink/UniversalLink';
import config from '@plone/volto/registry';
import { flattenToAppURL } from '@plone/volto/helpers/Url/Url';
import { REGISTRATION_MODAL } from '@plone-collective/volto-techevent/constants/Registration';
import { useEventSettings } from '@plone-collective/volto-techevent/hooks/useEventSettings';
import { useRegistration } from '@plone-collective/volto-techevent/hooks/useRegistration';
import messages from '@plone-collective/volto-techevent/components/Registration/messages';
import RegistrationModal from '@plone-collective/volto-techevent/components/Registration/RegistrationModal';
import type { BlockViewProps } from '@plone/types';
import type { RegistrationModalProps } from '@plone-collective/volto-techevent/types/registration';

interface RegistrationBlockData {
  title?: string;
  buttonLabel?: string;
}

/**
 * The modal registered as `TechEventRegistrationModal`, or the default one.
 */
export function registrationModalComponent(): React.ComponentType<RegistrationModalProps> {
  return (
    (config.getComponent({ name: REGISTRATION_MODAL }).component as
      | React.ComponentType<RegistrationModalProps>
      | undefined) ?? RegistrationModal
  );
}

/**
 * The registration block: a button that opens the registration form, or
 * the registrant's registration, in a modal. When there is nothing to do,
 * it says why instead.
 */
const View: React.FC<BlockViewProps & { isEditMode?: boolean }> = ({
  data,
  className,
  style,
  isEditMode,
}) => {
  const intl = useIntl();
  const [open, setOpen] = useState(false);
  const { title, buttonLabel } = data as RegistrationBlockData;
  const eventRoot = useEventSettings()?.eventRoot ?? '';
  const isLoggedIn = useSelector(
    (state: { userSession?: { token?: string | null } }) =>
      Boolean(state.userSession?.token),
  );
  const { status, loading, error, submitting, submitError, register, cancel } =
    useRegistration(eventRoot, isLoggedIn);
  const Modal = registrationModalComponent();

  const message = (text: string) => (
    <p className="registration-message">{text}</p>
  );

  const body = () => {
    if (loading && !status) {
      return <p>{intl.formatMessage(messages.loading)}</p>;
    }
    if (error) {
      return <Message error content={error} />;
    }
    if (!status) {
      // No Attendees container: nothing for visitors, a hint for editors
      return isEditMode
        ? message(intl.formatMessage(messages.noRegistration))
        : null;
    }
    if (!status.registration && !status.open) {
      return message(
        intl.formatMessage(
          status.expired ? messages.deadlinePassed : messages.notOpen,
        ),
      );
    }
    if (
      !status.registration &&
      !isLoggedIn &&
      !status.allow_anonymous_registration
    ) {
      const loginUrl = `/login?return_url=${encodeURIComponent(
        flattenToAppURL(eventRoot),
      )}`;
      return (
        <p className="registration-message">
          {intl.formatMessage(messages.logInToRegister)}{' '}
          <UniversalLink href={loginUrl}>
            {intl.formatMessage(messages.logIn)}
          </UniversalLink>
        </p>
      );
    }
    const label = status.registration
      ? intl.formatMessage(messages.yourRegistration)
      : buttonLabel || intl.formatMessage(messages.register);
    return (
      <>
        <Button
          primary
          className="registration-button"
          onClick={() => !isEditMode && setOpen(true)}
        >
          {label}
        </Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title={title}
          status={status}
          isLoggedIn={isLoggedIn}
          submitting={submitting}
          error={submitError}
          onRegister={register}
          onCancel={cancel}
        />
      </>
    );
  };

  const content = body();
  if (!content && !title) return null;
  return (
    <Container className={cx('block registration', className)} style={style}>
      {title && <h2 className="registration-title">{title}</h2>}
      {content}
    </Container>
  );
};

export default View;
