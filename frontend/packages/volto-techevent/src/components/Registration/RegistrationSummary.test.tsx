// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { fireEvent, screen } from '@testing-library/react';
import RegistrationSummary from './RegistrationSummary';
import { pendingRegistration, registration } from './fixtures';
import { renderInVolto } from '../../testing/render';

describe('RegistrationSummary', () => {
  it('shows the code and the state', () => {
    const { container } = renderInVolto(
      <RegistrationSummary registration={registration} />,
    );
    expect(container.querySelector('.registration-code')?.textContent).toBe(
      'PYC26-7KQ3M9XD',
    );
    expect(container.querySelector('.registration-state')?.textContent).toBe(
      'Registered',
    );
    expect(container.querySelector('.registration-next-step')).toBeNull();
  });

  it('asks an unverified registrant to check the email', () => {
    const { container } = renderInVolto(
      <RegistrationSummary registration={pendingRegistration} />,
    );
    expect(
      container.querySelector('.registration-next-step')?.textContent,
    ).toMatch(/Check your email/);
  });

  it('tells a verified registrant the organizers will confirm', () => {
    const { container } = renderInVolto(
      <RegistrationSummary
        registration={{ ...pendingRegistration, email_verified: true }}
      />,
    );
    expect(
      container.querySelector('.registration-next-step')?.textContent,
    ).toBe('The organizers will confirm your registration.');
  });

  it('cancels only after a confirmation', () => {
    const onCancel = vi.fn();
    renderInVolto(
      <RegistrationSummary
        registration={registration}
        canCancel
        onCancel={onCancel}
      />,
    );
    fireEvent.click(screen.getByText('Cancel my registration'));
    expect(onCancel).not.toHaveBeenCalled();
    fireEvent.click(screen.getByText('Yes, cancel it'));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('keeps the registration when the user changes their mind', () => {
    const onCancel = vi.fn();
    renderInVolto(
      <RegistrationSummary
        registration={registration}
        canCancel
        onCancel={onCancel}
      />,
    );
    fireEvent.click(screen.getByText('Cancel my registration'));
    fireEvent.click(screen.getByText('Keep my registration'));
    expect(onCancel).not.toHaveBeenCalled();
    expect(screen.getByText('Cancel my registration')).toBeTruthy();
  });

  it.each(['attended', 'cancelled'] as const)(
    'offers no cancel once %s',
    (state) => {
      renderInVolto(
        <RegistrationSummary
          registration={{ ...registration, state }}
          canCancel
          onCancel={vi.fn()}
        />,
      );
      expect(screen.queryByText('Cancel my registration')).toBeNull();
    },
  );

  it('offers no cancel without permission', () => {
    renderInVolto(
      <RegistrationSummary registration={registration} onCancel={vi.fn()} />,
    );
    expect(screen.queryByText('Cancel my registration')).toBeNull();
  });
});
