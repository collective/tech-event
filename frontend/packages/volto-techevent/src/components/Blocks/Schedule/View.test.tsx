import { describe, it, expect } from 'vitest';
import type { ComponentProps } from 'react';
import View from './View';
import { asProps, day, eventStore } from '../../Schedule/fixtures';
import { renderInVolto } from '../../../testing/render';

type Props = ComponentProps<typeof View>;

const scheduleState = (items: unknown) => ({
  ...eventStore,
  schedule: { items, loading: false, loaded: true, error: null },
});

describe('Schedule block View', () => {
  it('shows the schedule loaded for the event', () => {
    const { container } = renderInVolto(
      <View
        {...asProps<Props>({
          data: {
            '@type': 'scheduleBlock',
            title: 'Programme',
            filterByDay: [],
          },
        })}
      />,
      scheduleState([day]),
    );
    expect(
      container.querySelector('.block.schedule > .title')?.textContent,
    ).toBe('Programme');
    expect(container.querySelectorAll('.day-label')).toHaveLength(1);
  });

  it('shows nothing until the schedule has loaded', () => {
    const { container } = renderInVolto(
      <View
        {...asProps<Props>({
          data: { '@type': 'scheduleBlock', filterByDay: [] },
        })}
      />,
      scheduleState(undefined),
    );
    expect(container.querySelector('.block.schedule')).toBeNull();
  });
});
