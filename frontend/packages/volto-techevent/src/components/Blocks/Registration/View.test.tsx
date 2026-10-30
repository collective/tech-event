// @vitest-environment jsdom
import { afterEach, describe, it, expect } from 'vitest';
import { fireEvent } from '@testing-library/react';
import config from '@plone/volto/registry';
import View from './View';
import { blockViewProps } from '../Sponsors/fixtures';
import {
  closedStatus,
  ticketsStatus,
  expiredStatus,
  memberStatus,
  openStatus,
  registeredStatus,
  registrationStore,
} from '../../Registration/fixtures';
import RegistrationForm from '../../Registration/RegistrationForm';
import RegistrationModal from '../../Registration/RegistrationModal';
import { renderInVolto } from '../../../testing/render';
import type {
  RegistrationFormProps,
  RegistrationModalProps,
} from '../../../types/registration';

const props = (data: Record<string, unknown> = {}) =>
  blockViewProps({ type: 'eventRegistration', data });

const button = (container: HTMLElement) =>
  container.querySelector('button.registration-button') as HTMLButtonElement;

/** The modal renders in a portal, outside the block. */
const modal = () => document.body.querySelector('.registration-modal');

function openModal(container: HTMLElement) {
  fireEvent.click(button(container));
  return modal();
}

afterEach(() => {
  // Put the default components back after a test replaced one
  config.registerComponent({
    name: 'TechEventRegistrationModal',
    component: RegistrationModal,
  });
  config.registerComponent({
    name: 'TechEventRegistrationForm',
    component: RegistrationForm,
  });
});

describe('Registration block view', () => {
  it('shows a button, not the form', () => {
    const { container } = renderInVolto(
      <View {...props({ title: 'Join us' })} />,
      registrationStore(openStatus),
    );
    expect(container.querySelector('.registration-title')?.textContent).toBe(
      'Join us',
    );
    expect(button(container).textContent).toBe('Register');
    expect(container.querySelector('form')).toBeNull();
    expect(modal()).toBeNull();
  });

  it('uses the button label of the block', () => {
    const { container } = renderInVolto(
      <View {...props({ buttonLabel: 'Get your ticket' })} />,
      registrationStore(openStatus),
    );
    expect(button(container).textContent).toBe('Get your ticket');
  });

  it('opens the form in a modal', () => {
    const { container } = renderInVolto(
      <View {...props({ title: 'Join us' })} />,
      registrationStore(openStatus),
    );
    const dialog = openModal(container);
    expect(dialog?.querySelector('.header')?.textContent).toBe('Join us');
    expect(dialog?.querySelector('form.registration-form')).not.toBeNull();
    expect(
      dialog?.querySelector('.registration-deadline')?.textContent,
    ).toMatch(/^Registration closes on/);
  });

  it('closes the modal', () => {
    const { container } = renderInVolto(
      <View {...props()} />,
      registrationStore(openStatus),
    );
    const dialog = openModal(container);
    fireEvent.click(dialog!.querySelector('i.close.icon')!);
    expect(modal()).toBeNull();
  });

  it('pre-fills the form for a logged-in user', () => {
    const { container } = renderInVolto(
      <View {...props()} />,
      registrationStore(memberStatus, true),
    );
    const email = openModal(container)?.querySelector(
      'input[name="email"]',
    ) as HTMLInputElement;
    expect(email.value).toBe('ada@example.org');
  });

  it('asks anonymous visitors to log in when only accounts register', () => {
    const { container } = renderInVolto(
      <View {...props()} />,
      registrationStore(memberStatus),
    );
    expect(button(container)).toBeNull();
    expect(container.textContent).toContain(
      'Log in to register for this event.',
    );
    expect(container.querySelector('a')?.getAttribute('href')).toBe(
      '/login?return_url=%2Fevent',
    );
  });

  it('shows the registration in the modal once registered', () => {
    const { container } = renderInVolto(
      <View {...props()} />,
      registrationStore(registeredStatus, true),
    );
    expect(button(container).textContent).toBe('Your registration');
    const dialog = openModal(container);
    expect(dialog?.querySelector('.header')?.textContent).toBe(
      'Your registration',
    );
    expect(dialog?.querySelector('form')).toBeNull();
    expect(dialog?.querySelector('.registration-code')?.textContent).toBe(
      'PYC26-7KQ3M9XD',
    );
    expect(dialog?.textContent).toContain('Cancel my registration');
  });

  it('keeps the registration reachable after registration closes', () => {
    const { container } = renderInVolto(
      <View {...props()} />,
      registrationStore(
        { ...registeredStatus, state: 'closed', open: false },
        true,
      ),
    );
    expect(button(container).textContent).toBe('Your registration');
  });

  it('says when no ticket is available', () => {
    const { container } = renderInVolto(
      <View {...props()} />,
      registrationStore({ ...ticketsStatus, tickets: [] }, true),
    );
    expect(button(container)).toBeNull();
    expect(container.querySelector('.registration-message')?.textContent).toBe(
      'No tickets are available.',
    );
  });

  it('offers registration while a ticket is available', () => {
    const { container } = renderInVolto(
      <View {...props()} />,
      registrationStore(ticketsStatus, true),
    );
    expect(button(container)).not.toBeNull();
  });

  it('says registration is not open', () => {
    const { container } = renderInVolto(
      <View {...props()} />,
      registrationStore(closedStatus, true),
    );
    expect(button(container)).toBeNull();
    expect(container.querySelector('.registration-message')?.textContent).toBe(
      'Registration is not open.',
    );
  });

  it('says the deadline passed, although the database is open', () => {
    const { container } = renderInVolto(
      <View {...props()} />,
      registrationStore(expiredStatus, true),
    );
    expect(expiredStatus.state).toBe('open');
    expect(button(container)).toBeNull();
    expect(container.querySelector('.registration-message')?.textContent).toBe(
      'The registration deadline has passed.',
    );
  });

  it('shows nothing to visitors when the event takes no registrations', () => {
    const { container } = renderInVolto(
      <View {...props()} />,
      registrationStore(null),
    );
    expect(container.querySelector('.block.registration')).toBeNull();
  });

  it('tells editors the event takes no registrations', () => {
    const { container } = renderInVolto(
      <View {...props()} isEditMode />,
      registrationStore(null),
    );
    expect(container.textContent).toContain(
      'This event does not take registrations.',
    );
  });

  it('does not open the modal while editing', () => {
    const { container } = renderInVolto(
      <View {...props()} isEditMode />,
      registrationStore(openStatus),
    );
    fireEvent.click(button(container));
    expect(modal()).toBeNull();
  });
});

describe('Registration block components', () => {
  it('uses the modal registered in the component registry', () => {
    const CustomModal = ({ open, status }: RegistrationModalProps) =>
      open ? <div className="custom-modal">{status.state}</div> : null;
    config.registerComponent({
      name: 'TechEventRegistrationModal',
      component: CustomModal,
    });
    const { container } = renderInVolto(
      <View {...props()} />,
      registrationStore(openStatus),
    );
    fireEvent.click(button(container));
    expect(container.querySelector('.custom-modal')?.textContent).toBe('open');
    expect(modal()).toBeNull();
  });

  it('uses the form registered in the component registry', () => {
    const CustomForm = ({ defaults }: RegistrationFormProps) => (
      <p className="custom-form">{defaults?.email}</p>
    );
    config.registerComponent({
      name: 'TechEventRegistrationForm',
      component: CustomForm,
    });
    const { container } = renderInVolto(
      <View {...props()} />,
      registrationStore(memberStatus, true),
    );
    const dialog = openModal(container);
    expect(dialog?.querySelector('.custom-form')?.textContent).toBe(
      'ada@example.org',
    );
    expect(dialog?.querySelector('form.registration-form')).toBeNull();
  });
});
