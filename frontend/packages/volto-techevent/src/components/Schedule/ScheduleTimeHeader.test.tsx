import { describe, it, expect } from 'vitest';
import microphoneSVG from '@plone-collective/volto-techevent/icons/microphone.svg';
import ScheduleTimeHeader from './ScheduleTimeHeader';
import { renderInVolto } from '../../testing/render';
import { formatHour } from '../../helpers/date';

const start = '2026-10-13T09:00:00-03:00';
const entry = {
  kind: 'time' as const,
  start,
  gridRow: 'time-0900',
  icon: microphoneSVG,
};

describe('ScheduleTimeHeader', () => {
  it('shows the start hour on the row of the time', () => {
    const { container } = renderInVolto(<ScheduleTimeHeader entry={entry} />);
    const header = container.querySelector<HTMLElement>('.row-header');
    expect(header?.style.gridRow).toBe('time-0900');
    expect(header?.style.gridColumn).toBe('times');
    expect(container.querySelector('.time-indication')?.textContent).toBe(
      formatHour(new Date(start)),
    );
  });

  it('shows the icon of the time', () => {
    const { container } = renderInVolto(<ScheduleTimeHeader entry={entry} />);
    expect(container.querySelector('.icon-type svg')).not.toBeNull();
  });
});
