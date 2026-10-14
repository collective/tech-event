import { describe, it, expect } from 'vitest';
import SessionPresenters from './SessionPresenters';
import {
  brainWithPresenters,
  presenterAda,
  presenterGrace,
  presenterKatherine,
} from './fixtures';
import { renderInVolto } from '../../testing/render';

describe('SessionPresenters', () => {
  it('links a single presenter', () => {
    const { getByRole, container } = renderInVolto(
      <SessionPresenters item={brainWithPresenters([presenterAda])} />,
    );
    expect(getByRole('link', { name: 'Ada Lovelace' })).toBeTruthy();
    expect(container.querySelector('.presenters')?.textContent).toBe(
      'Ada Lovelace',
    );
  });

  it('joins two presenters with an ampersand', () => {
    const { container } = renderInVolto(
      <SessionPresenters
        item={brainWithPresenters([presenterAda, presenterGrace])}
      />,
    );
    expect(container.querySelector('.presenters')?.textContent).toBe(
      'Ada Lovelace & Grace Hopper',
    );
  });

  it('separates the others with commas and the last with an ampersand', () => {
    const { container } = renderInVolto(
      <SessionPresenters
        item={brainWithPresenters([
          presenterAda,
          presenterGrace,
          presenterKatherine,
        ])}
      />,
    );
    expect(container.querySelector('.presenters')?.textContent).toBe(
      'Ada Lovelace, Grace Hopper & Katherine Johnson',
    );
  });
});
