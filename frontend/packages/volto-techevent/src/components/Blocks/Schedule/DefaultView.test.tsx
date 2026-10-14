import { describe, it, expect } from 'vitest';
import DefaultView from './DefaultView';
import { asProps, day, eventStore } from '../../Schedule/fixtures';
import { renderInVolto } from '../../../testing/render';
import type { ComponentProps } from 'react';

type Props = ComponentProps<typeof DefaultView>;

describe('Schedule block DefaultView', () => {
  it('shows the block title above the schedule', () => {
    const { container } = renderInVolto(
      <DefaultView
        {...asProps<Props>({
          data: {
            '@type': 'scheduleBlock',
            title: 'Programme',
            filterByDay: [],
            displayDayIndex: true,
          },
          items: [day],
        })}
      />,
      eventStore,
    );
    expect(
      container.querySelector('.block.schedule > .title')?.textContent,
    ).toBe('Programme');
    expect(container.querySelectorAll('.day-label')).toHaveLength(1);
  });

  it('omits the title when the block has none', () => {
    const { container } = renderInVolto(
      <DefaultView
        {...asProps<Props>({
          data: {
            '@type': 'scheduleBlock',
            title: '',
            filterByDay: [],
            displayDayIndex: false,
          },
          items: [day],
        })}
      />,
      eventStore,
    );
    expect(container.querySelector('.block.schedule > .title')).toBeNull();
    expect(container.querySelector('.block.schedule .schedule')).not.toBeNull();
  });

  it('shows edit mode when the editor passes isEditMode', () => {
    const { container } = renderInVolto(
      <DefaultView
        {...asProps<Props>({
          data: { '@type': 'scheduleBlock', title: '', filterByDay: [] },
          items: [day],
          isEditMode: true,
        })}
      />,
      eventStore,
    );
    expect(container.textContent).toContain('Schedule Edit Mode');
  });

  it('shows edit mode when the stored block data says so', () => {
    const { container } = renderInVolto(
      <DefaultView
        {...asProps<Props>({
          data: {
            '@type': 'scheduleBlock',
            title: '',
            filterByDay: [],
            isEditMode: true,
          },
          items: [day],
        })}
      />,
      eventStore,
    );
    expect(container.textContent).toContain('Schedule Edit Mode');
  });
});
