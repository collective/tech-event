// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import Card from './Card';
import { renderInVolto } from '../../../testing/render';

describe('Card', () => {
  it('renders a plain card with its class and no link', () => {
    const { container, queryByRole } = renderInVolto(
      <Card className="profile">
        <Card.Summary>Hello</Card.Summary>
      </Card>,
    );
    const card = container.querySelector('.card');
    expect(card?.classList.contains('profile')).toBe(true);
    expect(card?.getAttribute('role')).toBeNull();
    expect(card?.getAttribute('tabindex')).toBeNull();
    expect(queryByRole('link')).toBeNull();
  });

  it('makes the whole card a focusable link when given an href', () => {
    const { container } = renderInVolto(
      <Card href="/news/first">
        <Card.Summary>Hello</Card.Summary>
      </Card>,
    );
    const card = container.querySelector('.card');
    expect(card?.getAttribute('role')).toBe('link');
    expect(card?.getAttribute('tabindex')).toBe('0');
    expect(container.querySelector('a')?.getAttribute('href')).toBe(
      '/news/first',
    );
  });

  it('opens the link in a new tab when asked', () => {
    const { container } = renderInVolto(
      <Card href="https://example.org/a" openLinkInNewTab>
        <Card.Summary>Hello</Card.Summary>
      </Card>,
    );
    expect(container.querySelector('a')?.getAttribute('target')).toBe('_blank');
  });

  it('shows the image from its source', () => {
    const { container } = renderInVolto(
      <Card>
        <Card.Image src="/images/logo.png" />
      </Card>,
    );
    expect(
      container.querySelector('.image-wrapper img')?.getAttribute('src'),
    ).toBe('/images/logo.png');
  });

  it('shows its children when there is no image', () => {
    const { container } = renderInVolto(
      <Card>
        <Card.Image>
          <span className="placeholder">No image</span>
        </Card.Image>
      </Card>,
    );
    expect(container.querySelector('.image-wrapper img')).toBeNull();
    expect(
      container.querySelector('.image-wrapper .placeholder')?.textContent,
    ).toBe('No image');
  });

  it('puts the actions in their own wrapper', () => {
    const { container } = renderInVolto(
      <Card>
        <Card.Actions>
          <button type="button">Vote</button>
        </Card.Actions>
      </Card>,
    );
    expect(
      container.querySelector('.actions-wrapper button')?.textContent,
    ).toBe('Vote');
  });
});
