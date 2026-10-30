import React from 'react';
import { useIntl } from 'react-intl';
import { Modal } from 'semantic-ui-react';
import config from '@plone/volto/registry';
import { REGISTRATION_FORM } from '@plone-collective/volto-techevent/constants/Registration';
import messages from './messages';
import RegistrationDeadline from './RegistrationDeadline';
import RegistrationForm from './RegistrationForm';
import RegistrationSummary from './RegistrationSummary';
import type {
  RegistrationFormProps,
  RegistrationModalProps,
} from '@plone-collective/volto-techevent/types/registration';

/**
 * The registration form registered as `TechEventRegistrationForm`, or the
 * default one.
 */
export function registrationFormComponent(): React.ComponentType<RegistrationFormProps> {
  return (
    (config.getComponent({ name: REGISTRATION_FORM }).component as
      | React.ComponentType<RegistrationFormProps>
      | undefined) ?? RegistrationForm
  );
}

/**
 * The modal of the registration block: the form, or the user's registration
 * once there is one. The default `TechEventRegistrationModal` of the
 * component registry.
 */
const RegistrationModal: React.FC<RegistrationModalProps> = ({
  open,
  onClose,
  title,
  status,
  isLoggedIn,
  submitting = false,
  error = null,
  onRegister,
  onCancel,
}) => {
  const intl = useIntl();
  const Form = registrationFormComponent();
  const { registration } = status;
  const header =
    title ||
    intl.formatMessage(
      registration
        ? messages.yourRegistration
        : messages.registrationBlockTitle,
    );

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="small"
      closeIcon
      className="registration-modal"
    >
      <Modal.Header>{header}</Modal.Header>
      <Modal.Content>
        {registration ? (
          <RegistrationSummary
            registration={registration}
            canCancel={isLoggedIn}
            submitting={submitting}
            error={error}
            onCancel={onCancel}
          />
        ) : (
          <>
            <RegistrationDeadline closesAt={status.closes_at} />
            <Form
              defaults={status.defaults}
              submitting={submitting}
              error={error}
              onSubmit={onRegister}
            />
          </>
        )}
      </Modal.Content>
    </Modal>
  );
};

export default RegistrationModal;
