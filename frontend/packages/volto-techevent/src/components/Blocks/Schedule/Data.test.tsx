import { describe, it, expect } from 'vitest';
import Data from './Data';
import { eventStore } from '../../Schedule/fixtures';
import { renderInVolto } from '../../../testing/render';

describe('Schedule block Data', () => {
  // Volto's BlockDataForm is loaded lazily and its Field is mocked in tests,
  // so each field shows as "<title> - <description>".
  it('shows the sidebar fields for the schedule', async () => {
    const { findByText } = renderInVolto(
      <Data
        block="schedule-1"
        data={{ '@type': 'scheduleBlock', title: 'Programme', filterByDay: [] }}
        onChangeBlock={() => {}}
      />,
      eventStore,
    );
    expect(await findByText(/^Display Headline\?/)).toBeTruthy();
    expect(await findByText(/^Filter by Day/)).toBeTruthy();
  });
});
