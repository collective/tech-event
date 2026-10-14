import { describe, it, expect } from 'vitest';
import SlotView from './SlotView';
import { slotContent } from './fixtures';
import { renderInVolto } from '../../testing/render';

describe('SlotView', () => {
  it('shows the title, the description and the time of a slot', () => {
    const { container } = renderInVolto(<SlotView content={slotContent} />);
    expect(container.querySelector('.slot-view.Slot')).not.toBeNull();
    expect(container.querySelector('.sessionTitle')?.textContent).toBe('Lunch');
    expect(container.querySelector('.sessionDescription')?.textContent).toBe(
      'Bring your own plate.',
    );
    expect(container.querySelector('.slotDate')).not.toBeNull();
  });

  it('shows no room when the slot has none', () => {
    const { container } = renderInVolto(<SlotView content={slotContent} />);
    expect(container.querySelector('.slotRoom')).toBeNull();
  });
});
