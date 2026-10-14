import { describe, it, expect } from 'vitest';
import SlotTile from './SlotTile';
import { slotBrain } from './fixtures';
import { renderInVolto } from '../../testing/render';

describe('SlotTile', () => {
  it('shows the title and description of a slot', () => {
    const { container } = renderInVolto(
      <SlotTile item={slotBrain} showDescription />,
    );
    const tile = container.querySelector('.slotTile');
    expect(tile?.className).toContain('Slot');
    expect(tile?.className).toContain('slot-lunch');
    expect(container.querySelector('.slotTitle')?.textContent).toBe('Lunch');
    expect(container.querySelector('.slotDescription')?.textContent).toBe(
      'Bring your own plate.',
    );
    expect(container.querySelector('.slotDate')).not.toBeNull();
  });

  it('hides the description when told to', () => {
    const { container } = renderInVolto(
      <SlotTile item={slotBrain} showDescription={false} />,
    );
    expect(container.querySelector('.slotDescription')).toBeNull();
    expect(container.querySelector('.slotTitle')?.textContent).toBe('Lunch');
  });
});
