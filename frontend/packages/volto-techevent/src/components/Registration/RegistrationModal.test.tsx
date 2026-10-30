// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { fireEvent } from '@testing-library/react';
import RegistrationModal, {
  registrationFormComponent,
} from './RegistrationModal';
import RegistrationForm from './RegistrationForm';
import { memberStatus, openStatus, registeredStatus } from './fixtures';
import { renderInVolto } from '../../testing/render';
import type { RegistrationModalProps } from '../../types/registration';

function renderModal(overrides: Partial<RegistrationModalProps> = {}) {
  const handlers = {
    onClose: vi.fn(),
    onRegister: vi.fn(),
    onCancel: vi.fn(),
  };
  renderInVolto(
    <RegistrationModal
      open
      status={openStatus}
      isLoggedIn={false}
      {...handlers}
      {...overrides}
    />,
  );
  return {
    ...handlers,
    dialog: document.body.querySelector('.registration-modal') as HTMLElement,
  };
}

describe('registrationFormComponent', () => {
  it('defaults to the registration form', () => {
    expect(registrationFormComponent()).toBe(RegistrationForm);
  });
});

describe('RegistrationModal', () => {
  it('renders nothing while closed', () => {
    renderInVolto(
      <RegistrationModal
        open={false}
        status={openStatus}
        isLoggedIn={false}
        onClose={vi.fn()}
        onRegister={vi.fn()}
        onCancel={vi.fn()}
      />,
    );
    expect(document.body.querySelector('.registration-modal')).toBeNull();
  });

  it('shows the form, titled after the block', () => {
    const { dialog } = renderModal();
    expect(dialog.querySelector('.header')?.textContent).toBe(
      'Event Registration',
    );
    expect(dialog.querySelector('form.registration-form')).not.toBeNull();
  });

  it('uses the given title', () => {
    const { dialog } = renderModal({ title: 'Join us' });
    expect(dialog.querySelector('.header')?.textContent).toBe('Join us');
  });

  it('registers with the form data', () => {
    const { dialog, onRegister } = renderModal({ status: memberStatus });
    fireEvent.submit(dialog.querySelector('form')!);
    expect(onRegister).toHaveBeenCalledWith({
      first_name: 'Ada',
      last_name: 'Lovelace',
      email: 'ada@example.org',
    });
  });

  it('shows the registration once there is one', () => {
    const { dialog } = renderModal({
      status: registeredStatus,
      isLoggedIn: true,
    });
    expect(dialog.querySelector('form')).toBeNull();
    expect(dialog.querySelector('.registration-code')?.textContent).toBe(
      'PYC26-7KQ3M9XD',
    );
    expect(dialog.textContent).toContain('Cancel my registration');
  });

  it('closes with its close icon, its only way out', () => {
    const { dialog, onClose } = renderModal();
    expect(dialog.querySelector('.actions')).toBeNull();
    fireEvent.click(dialog.querySelector('i.close.icon')!);
    expect(onClose).toHaveBeenCalled();
  });
});
