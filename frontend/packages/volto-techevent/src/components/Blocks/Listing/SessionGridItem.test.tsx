import { describe, it, expect } from 'vitest';
import SessionGridItem from './SessionGridItem';
import { brainSession, eventStore } from '../../Schedule/fixtures';
import { renderInVolto } from '../../../testing/render';

describe('SessionGridItem', () => {
  it('shows the session card with its title and description', () => {
    const { container, getByRole, getByText } = renderInVolto(
      <SessionGridItem item={brainSession} />,
      eventStore,
    );
    expect(
      container.querySelector('.card-container.session .item'),
    ).not.toBeNull();
    expect(getByRole('link', { name: 'Building with Volto' })).toBeTruthy();
    expect(getByText('Blocks, from zero to published.')).toBeTruthy();
    expect(container.querySelector('.sessionLevels')).not.toBeNull();
    expect(container.querySelector('.sessionAudiences')).not.toBeNull();
  });
});
