// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import RegistrationDeadline from './RegistrationDeadline';
import { renderInVolto } from '../../testing/render';

describe('RegistrationDeadline', () => {
  it('shows when registration closes', () => {
    const { container } = renderInVolto(
      <RegistrationDeadline closesAt="2030-11-20T21:00:00+00:00" />,
    );
    const text = container.querySelector('.registration-deadline')?.textContent;
    expect(text).toMatch(/^Registration closes on .*2030.*\.$/);
  });

  it('shows nothing without a deadline', () => {
    const { container } = renderInVolto(
      <RegistrationDeadline closesAt={null} />,
    );
    expect(container.querySelector('.registration-deadline')).toBeNull();
  });
});
