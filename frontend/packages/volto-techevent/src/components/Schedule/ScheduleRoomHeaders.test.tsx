import { describe, it, expect } from 'vitest';
import ScheduleRoomHeaders from './ScheduleRoomHeaders';
import { renderInVolto } from '../../testing/render';

describe('ScheduleRoomHeaders', () => {
  it('places each room in its own column', () => {
    const { container } = renderInVolto(
      <ScheduleRoomHeaders
        rooms={[
          ['room-a', 'Room A'],
          ['room-b', 'Room B'],
        ]}
      />,
    );
    const headers = Array.from(
      container.querySelectorAll<HTMLElement>('.room-header'),
    );
    expect(headers.map((el) => el.textContent)).toEqual(['Room A', 'Room B']);
    expect(headers.map((el) => el.style.gridColumn)).toEqual([
      'room-1',
      'room-2',
    ]);
    expect(headers[1].classList.contains('room-b')).toBe(true);
  });

  it('falls back to the room id without a label', () => {
    const { container } = renderInVolto(
      <ScheduleRoomHeaders rooms={[['room-a', '']]} />,
    );
    expect(container.querySelector('.room-label')?.textContent).toBe('room-a');
  });

  it('always renders the corner header', () => {
    const { container } = renderInVolto(<ScheduleRoomHeaders rooms={[]} />);
    expect(
      container.querySelector('.day-header .icon-type svg'),
    ).not.toBeNull();
    expect(container.querySelectorAll('.room-header')).toHaveLength(0);
  });
});
