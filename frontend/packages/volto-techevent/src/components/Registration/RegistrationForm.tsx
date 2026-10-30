import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { Button, Form, Message } from 'semantic-ui-react';
import messages from './messages';
import type {
  RegistrationData,
  RegistrationFormProps,
} from '@plone-collective/volto-techevent/types/registration';

const FIELDS = [
  { name: 'first_name', label: messages.firstName, type: 'text' },
  { name: 'last_name', label: messages.lastName, type: 'text' },
  { name: 'email', label: messages.email, type: 'email' },
] as const;

/**
 * The registration form: names and email, pre-filled for a logged-in user.
 * The default `TechEventRegistrationForm` of the component registry.
 */
const RegistrationForm: React.FC<RegistrationFormProps> = ({
  defaults,
  submitting = false,
  error = null,
  onSubmit,
}) => {
  const intl = useIntl();
  const [data, setData] = useState<RegistrationData>({
    first_name: defaults?.first_name ?? '',
    last_name: defaults?.last_name ?? '',
    email: defaults?.email ?? '',
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit({
      first_name: data.first_name.trim(),
      last_name: data.last_name.trim(),
      email: data.email.trim(),
    });
  };

  return (
    <Form
      className="registration-form"
      onSubmit={handleSubmit}
      error={Boolean(error)}
      loading={submitting}
    >
      {FIELDS.map(({ name, label, type }) => (
        <Form.Input
          key={name}
          id={`registration-${name}`}
          name={name}
          type={type}
          label={intl.formatMessage(label)}
          value={data[name]}
          required
          onChange={(_event, { value }) =>
            setData((current) => ({ ...current, [name]: value }))
          }
        />
      ))}
      {error && <Message error content={error} />}
      <Button primary type="submit" disabled={submitting}>
        {intl.formatMessage(messages.register)}
      </Button>
    </Form>
  );
};

export default RegistrationForm;
