import { describe, it, expect } from 'vitest';
import { fireEvent } from '@testing-library/react';
import RequestOneTimePassword from './AttendeeLogin';
import { renderInVolto } from '../../testing/render';

const usersState = {
  users: { reset: { loading: false, loaded: false, error: null } },
};

describe('RequestOneTimePassword', () => {
  // Volto's Form is loaded lazily, and its Field is mocked in tests, so the
  // field shows as "<title> - <description>". Match the label by prefix.
  it('asks for an email address', async () => {
    const { findByText, findByRole } = renderInVolto(
      <RequestOneTimePassword />,
      usersState,
    );
    expect(await findByText('Request a one-time password')).toBeTruthy();
    expect(await findByText(/^My email is/)).toBeTruthy();
    expect(await findByRole('button', { name: 'Send request' })).toBeTruthy();
  });

  it('does not send a request without an email', async () => {
    // Volto's Form rejects the empty required field before onSubmit runs,
    // so the form reports its generic error and the success view never shows.
    const { findByRole, findByText, queryByText } = renderInVolto(
      <RequestOneTimePassword />,
      usersState,
    );
    fireEvent.click(await findByRole('button', { name: 'Send request' }));
    expect(await findByText('There were some errors.')).toBeTruthy();
    expect(queryByText('One-time password sent')).toBeNull();
  });
});
