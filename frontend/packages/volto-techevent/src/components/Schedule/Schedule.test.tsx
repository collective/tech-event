import { describe, it, expect } from 'vitest';
import Schedule from './Schedule';
import { day, emptyDay, eventStore } from './fixtures';
import { renderInVolto } from '../../testing/render';

const dayLabels = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('.day-label .heading')).map(
    (el) => el.textContent,
  );

describe('Schedule', () => {
  it('shows one tab per day, numbered', () => {
    const { container } = renderInVolto(
      <Schedule
        items={[day, emptyDay]}
        filterByDay={[]}
        displayDayIndex
        isEditMode={false}
      />,
      eventStore,
    );
    expect(dayLabels(container)).toEqual(['Day 1', 'Day 2']);
  });

  it('keeps only the days picked in filterByDay', () => {
    const { container } = renderInVolto(
      <Schedule
        items={[day, emptyDay]}
        filterByDay={['2026-10-14']}
        displayDayIndex
        isEditMode={false}
      />,
      eventStore,
    );
    expect(container.querySelectorAll('.day-label')).toHaveLength(1);
    expect(dayLabels(container)).toEqual(['Day 1']);
  });

  it('hides the day numbers when displayDayIndex is off', () => {
    const { container } = renderInVolto(
      <Schedule
        items={[day]}
        filterByDay={[]}
        displayDayIndex={false}
        isEditMode={false}
      />,
      eventStore,
    );
    expect(container.querySelectorAll('.day-label')).toHaveLength(1);
    expect(container.querySelector('.day-label .heading')).toBeNull();
  });

  it('marks edit mode', () => {
    const { container } = renderInVolto(
      <Schedule items={[day]} filterByDay={[]} isEditMode />,
      eventStore,
    );
    expect(container.textContent).toContain('Schedule Edit Mode');
  });
});
