// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import RegistrationStateLabel from './RegistrationStateLabel';
import { renderInVolto } from '../../testing/render';

describe('RegistrationStateLabel', () => {
  it.each([
    ['pending', 'Pending'],
    ['registered', 'Registered'],
    ['attended', 'Attended'],
    ['cancelled', 'Cancelled'],
  ] as const)('labels %s', (state, label) => {
    const { container } = renderInVolto(
      <RegistrationStateLabel state={state} />,
    );
    const span = container.querySelector('.registration-state');
    expect(span?.textContent).toBe(label);
    expect(span?.classList.contains(`registration-state-${state}`)).toBe(true);
  });
});
