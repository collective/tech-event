// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Wrapper from '@plone/volto/storybook';
import RegistrationVerify from './RegistrationVerify';
import { pendingRegistration, registration } from './fixtures';
import { initialState } from '../../reducers/registration/registration';

function renderAt(
  path: string,
  verify: Partial<typeof initialState.verify> = {},
) {
  return render(
    <Wrapper
      anonymous
      location={path}
      customStore={{
        registration: {
          ...initialState,
          verify: { ...initialState.verify, ...verify },
        },
      }}
    >
      <RegistrationVerify />
    </Wrapper>,
  );
}

describe('RegistrationVerify', () => {
  it('refuses a link without a token', () => {
    const { container } = renderAt('/event/registration/verify');
    expect(container.querySelector('.ui.error.message')?.textContent).toBe(
      'This link is invalid or has expired.',
    );
  });

  it('shows the progress', () => {
    const { container } = renderAt('/event/registration/verify?token=abc', {
      loading: true,
    });
    expect(container.textContent).toContain('Confirming your email address…');
  });

  it('shows the confirmed registration', () => {
    const { container } = renderAt('/event/registration/verify?token=abc', {
      result: registration,
    });
    expect(container.querySelector('.ui.success.message')?.textContent).toBe(
      'Your email address is confirmed.',
    );
    expect(container.querySelector('.registration-code')?.textContent).toBe(
      'PYC26-7KQ3M9XD',
    );
  });

  it('shows a registration that waits for the organizers', () => {
    const { container } = renderAt('/event/registration/verify?token=abc', {
      result: { ...pendingRegistration, email_verified: true },
    });
    expect(
      container.querySelector('.registration-next-step')?.textContent,
    ).toBe('The organizers will confirm your registration.');
  });

  it('shows why a token was refused', () => {
    const { container } = renderAt('/event/registration/verify?token=abc', {
      error: 'This link is invalid or has expired.',
    });
    expect(container.querySelector('.ui.error.message')?.textContent).toBe(
      'This link is invalid or has expired.',
    );
  });
});
