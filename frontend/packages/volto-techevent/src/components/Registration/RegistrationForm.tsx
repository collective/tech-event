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
 * The registration form: names and email, pre-filled for a logged-in user,
 * and the choice of a ticket when there are several. The only ticket
 * available needs no choice. The default `TechEventRegistrationForm` of the
 * component registry.
 */
const RegistrationForm: React.FC<RegistrationFormProps> = ({
  defaults,
  tickets = [],
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
  const [ticket, setTicket] = useState(
    tickets.length === 1 ? tickets[0].UID : '',
  );
  const choosing = tickets.length > 1;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit({
      first_name: data.first_name.trim(),
      last_name: data.last_name.trim(),
      email: data.email.trim(),
      ...(ticket ? { ticket } : {}),
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
      {choosing && (
        <Form.Field required className="registration-tickets">
          <label id="registration-ticket">
            {intl.formatMessage(messages.ticket)}
          </label>
          {tickets.map(({ UID, title, description }) => (
            <React.Fragment key={UID}>
              <Form.Radio
                id={`registration-ticket-${UID}`}
                name="ticket"
                value={UID}
                label={title}
                aria-describedby="registration-ticket"
                checked={ticket === UID}
                onChange={() => setTicket(UID)}
              />
              {description && (
                <p className="registration-ticket-description">{description}</p>
              )}
            </React.Fragment>
          ))}
        </Form.Field>
      )}
      {error && <Message error content={error} />}
      <Button
        primary
        type="submit"
        disabled={submitting || (choosing && !ticket)}
      >
        {intl.formatMessage(messages.register)}
      </Button>
    </Form>
  );
};

export default RegistrationForm;
