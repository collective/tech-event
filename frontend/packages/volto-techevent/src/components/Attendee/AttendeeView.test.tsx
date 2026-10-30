// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import AttendeeView from './AttendeeView';
import { renderInVolto } from '../../testing/render';

const content = {
  id: 'PYC26-7KQ3M9XD',
  title: 'Ada Lovelace',
  email: 'ada@example.org',
  email_verified: true,
  review_state: 'registered' as const,
};

const terms = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('dt')).map((dt) => dt.textContent);

describe('AttendeeView', () => {
  it('shows the name, code, state and email address', () => {
    const { container } = renderInVolto(<AttendeeView content={content} />);
    expect(container.querySelector('h1')?.textContent).toBe('Ada Lovelace');
    expect(terms(container)).toEqual(['Registration code', 'Status', 'Email']);
    expect(container.querySelector('.registration-code')?.textContent).toBe(
      'PYC26-7KQ3M9XD',
    );
    expect(container.querySelector('.registration-state')?.textContent).toBe(
      'Registered',
    );
    expect(container.querySelector('.attendee-email')?.textContent).toBe(
      'ada@example.org (Email confirmed)',
    );
  });

  it('says when the email address is not confirmed', () => {
    const { container } = renderInVolto(
      <AttendeeView content={{ ...content, email_verified: false }} />,
    );
    expect(container.querySelector('.attendee-email-status')?.textContent).toBe(
      '(Email not confirmed)',
    );
  });

  it('leaves out what the content does not carry', () => {
    const { container } = renderInVolto(
      <AttendeeView content={{ id: 'PYC26-7KQ3M9XD', title: 'Ada' }} />,
    );
    expect(terms(container)).toEqual(['Registration code']);
  });

  it('shows the ticket', () => {
    const { container } = renderInVolto(
      <AttendeeView
        content={{
          ...content,
          ticket: { token: 'ticket-full', title: 'Full conference' },
        }}
      />,
    );
    expect(terms(container)).toContain('Ticket');
    expect(container.querySelector('.registration-ticket')?.textContent).toBe(
      'Full conference',
    );
  });
});
