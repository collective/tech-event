// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import PresenterTile from './PresenterTile';
import { presenterAda } from './fixtures';
import { renderInVolto } from '../../testing/render';

describe('PresenterTile', () => {
  it('links the presenter by name', () => {
    const { getByRole } = renderInVolto(<PresenterTile item={presenterAda} />);
    const link = getByRole('link', { name: 'Ada Lovelace' });
    expect(link.getAttribute('href')).toBe(presenterAda['@id']);
  });

  it('marks the tile with the type of the content', () => {
    const { container } = renderInVolto(<PresenterTile item={presenterAda} />);
    const tile = container.querySelector('.presenterTile');
    expect(tile?.classList.contains('Presenter')).toBe(true);
  });

  it('shows the default image when the presenter has no image', () => {
    const { getByAltText } = renderInVolto(
      <PresenterTile item={presenterAda} />,
    );
    expect(getByAltText('Default image')).toBeTruthy();
  });

  it('shows no links when there are no social links', () => {
    const { container } = renderInVolto(<PresenterTile item={presenterAda} />);
    expect(container.querySelector('.presenterLinks')).toBeNull();
  });
});
