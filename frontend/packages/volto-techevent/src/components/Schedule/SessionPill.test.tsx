import { describe, it, expect } from 'vitest';
import SessionPill from './SessionPill';
import { renderInVolto } from '../../testing/render';

const VAR = '--vocabulary-background-color';

describe('SessionPill', () => {
  it('shows the term title with its class and color', () => {
    const { container } = renderInVolto(
      <SessionPill
        term={{ token: 'developers', title: 'Developers' }}
        className="sessionAudience"
        color="#ff0000"
      />,
    );
    const pill = container.querySelector<HTMLElement>('.sessionAudience');
    expect(pill?.style.getPropertyValue(VAR)).toBe('#ff0000');
    expect(container.querySelector('.audience.developers')?.textContent).toBe(
      'Developers',
    );
  });

  it('keeps the color it is given, including "unset"', () => {
    const { container } = renderInVolto(
      <SessionPill
        term={{ token: 'designers', title: 'Designers' }}
        className="sessionLevel"
        color="unset"
      />,
    );
    const pill = container.querySelector<HTMLElement>('.sessionLevel');
    expect(pill?.style.getPropertyValue(VAR)).toBe('unset');
    expect(container.querySelector('.audience.designers')?.textContent).toBe(
      'Designers',
    );
  });
});
