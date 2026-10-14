import { describe, it, expect } from 'vitest';
import SlotRoom from './SlotRoom';
import { renderInVolto } from '../../testing/render';

describe('SlotRoom', () => {
  it('shows the first room with its token as a class', () => {
    const { container } = renderInVolto(
      <SlotRoom
        item={{
          room: [
            { token: 'room-a', title: 'Room A' },
            { token: 'room-b', title: 'Room B' },
          ],
        }}
        className="sessionInfoItem"
      />,
    );
    const room = container.querySelector('.slotRoom');
    expect(room?.className).toBe('slotRoom room-a sessionInfoItem');
    expect(room?.querySelector('.title')?.textContent).toBe('Room A');
    expect(container.querySelectorAll('.slotRoom')).toHaveLength(1);
  });

  it('renders nothing without a room', () => {
    const { container } = renderInVolto(
      <SlotRoom item={{ room: [] }} className="" />,
    );
    expect(container.querySelector('.slotRoom')).toBeNull();
  });
});
