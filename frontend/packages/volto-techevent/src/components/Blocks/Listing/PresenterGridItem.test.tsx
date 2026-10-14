import { describe, it, expect, vi } from 'vitest';
import PresenterGridItem from './PresenterGridItem';
import { presenterAda } from '../../Schedule/fixtures';
import { renderInVolto } from '../../../testing/render';

// PresenterTile imports a social-media component path that the installed
// package does not provide, so the tile is stubbed to show only the title.
vi.mock('../../Presenter/PresenterTile', () => ({
  default: ({ item }: { item: { title: string } }) => (
    <div className="presenterTile">{item.title}</div>
  ),
}));

describe('PresenterGridItem', () => {
  it('shows the presenter card with the presenter', () => {
    const { container, getByText } = renderInVolto(
      <PresenterGridItem item={presenterAda} />,
    );
    expect(
      container.querySelector('.card-container.presenter .presenterTile'),
    ).not.toBeNull();
    expect(getByText('Ada Lovelace')).toBeTruthy();
  });
});
