// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { fireEvent } from '@testing-library/react';
import RegistrationForm from './RegistrationForm';
import { tickets } from './fixtures';
import { renderInVolto } from '../../testing/render';

const value = (container: HTMLElement, name: string) =>
  (container.querySelector(`input[name="${name}"]`) as HTMLInputElement).value;

describe('RegistrationForm', () => {
  it('is empty for an anonymous visitor', () => {
    const { container } = renderInVolto(
      <RegistrationForm onSubmit={vi.fn()} />,
    );
    expect(value(container, 'first_name')).toBe('');
    expect(value(container, 'email')).toBe('');
  });

  it('is pre-filled from the account', () => {
    const { container } = renderInVolto(
      <RegistrationForm
        defaults={{
          first_name: 'Ada',
          last_name: 'Lovelace',
          email: 'ada@example.org',
        }}
        onSubmit={vi.fn()}
      />,
    );
    expect(value(container, 'first_name')).toBe('Ada');
    expect(value(container, 'last_name')).toBe('Lovelace');
    expect(value(container, 'email')).toBe('ada@example.org');
  });

  it('submits the trimmed data', () => {
    const onSubmit = vi.fn();
    const { container } = renderInVolto(
      <RegistrationForm
        defaults={{
          first_name: 'Ada',
          last_name: 'Lovelace',
          email: 'ada@example.org',
        }}
        onSubmit={onSubmit}
      />,
    );
    fireEvent.change(container.querySelector('input[name="email"]')!, {
      target: { value: ' work@example.org ' },
    });
    fireEvent.submit(container.querySelector('form')!);
    expect(onSubmit).toHaveBeenCalledWith({
      first_name: 'Ada',
      last_name: 'Lovelace',
      email: 'work@example.org',
    });
  });

  it('shows the error of a refused registration', () => {
    const { container } = renderInVolto(
      <RegistrationForm
        error="This email is already registered for this event."
        onSubmit={vi.fn()}
      />,
    );
    expect(container.querySelector('.ui.error.message')?.textContent).toBe(
      'This email is already registered for this event.',
    );
  });

  it('does not ask for a ticket without tickets', () => {
    const { container } = renderInVolto(
      <RegistrationForm onSubmit={vi.fn()} />,
    );
    expect(container.querySelector('.registration-tickets')).toBeNull();
  });

  it('needs no choice for the only ticket, and submits it', () => {
    const onSubmit = vi.fn();
    const { container } = renderInVolto(
      <RegistrationForm
        defaults={{
          first_name: 'Ada',
          last_name: 'Lovelace',
          email: 'ada@example.org',
        }}
        tickets={[tickets[0]]}
        onSubmit={onSubmit}
      />,
    );
    expect(container.querySelector('.registration-tickets')).toBeNull();
    fireEvent.submit(container.querySelector('form')!);
    expect(onSubmit.mock.calls[0][0].ticket).toBe('ticket-full');
  });

  it('requires a choice between several tickets', () => {
    const onSubmit = vi.fn();
    const { container } = renderInVolto(
      <RegistrationForm
        defaults={{
          first_name: 'Ada',
          last_name: 'Lovelace',
          email: 'ada@example.org',
        }}
        tickets={tickets}
        onSubmit={onSubmit}
      />,
    );
    const submit = container.querySelector(
      'button[type="submit"]',
    ) as HTMLButtonElement;
    expect(submit.disabled).toBe(true);
    expect(
      container.querySelector('.registration-ticket-description')?.textContent,
    ).toBe('All days and tutorials');
    fireEvent.click(
      container.querySelector('#registration-ticket-ticket-tutorials')!,
    );
    expect(submit.disabled).toBe(false);
    fireEvent.submit(container.querySelector('form')!);
    expect(onSubmit.mock.calls[0][0].ticket).toBe('ticket-tutorials');
  });
});
