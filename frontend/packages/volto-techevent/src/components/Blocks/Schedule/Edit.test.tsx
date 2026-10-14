import { describe, it, expect } from 'vitest';
import Edit from './Edit';
import { day, eventStore } from '../../Schedule/fixtures';
import { renderInVolto } from '../../../testing/render';

describe('Schedule block Edit', () => {
  it('previews the schedule in edit mode', () => {
    const { container } = renderInVolto(
      <Edit
        data={{ '@type': 'scheduleBlock', title: 'Programme', filterByDay: [] }}
        block="schedule-1"
        blocksConfig={{
          scheduleBlock: {
            id: 'scheduleBlock',
            title: 'Schedule',
            extensions: {},
          },
        }}
        onChangeBlock={() => {}}
        selected={false}
      />,
      {
        ...eventStore,
        schedule: { items: [day], loading: false, loaded: true, error: null },
      },
    );
    // The edit label reads `data.isEditMode`, which Edit does not set, so
    // the preview is checked through the schedule itself.
    expect(container.querySelectorAll('.day-label')).toHaveLength(1);
    expect(
      container.querySelector('.block.schedule > .title')?.textContent,
    ).toBe('Programme');
  });
});
