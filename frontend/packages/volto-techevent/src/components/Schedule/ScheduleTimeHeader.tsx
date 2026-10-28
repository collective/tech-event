import React from 'react';
import Icon from '@plone/volto/components/theme/Icon/Icon';
import { formatHour } from '@plone-collective/volto-techevent/helpers/date';
import type { TimeEntry } from '@plone-collective/volto-techevent/helpers/schedule';

interface ScheduleTimeHeaderProps {
  entry: TimeEntry;
}

/** The row header of a start time: the icon of its first slot and the hour. */
const ScheduleTimeHeader: React.FC<ScheduleTimeHeaderProps> = ({ entry }) => (
  <div
    className="row-header"
    style={{ gridColumn: 'times', gridRow: entry.gridRow }}
  >
    <div className="aside-indication">
      <div className="icon-type">
        <Icon name={entry.icon} />
      </div>
      <div className="time-indication">
        {formatHour(new Date(entry.start ?? ''))}
      </div>
    </div>
  </div>
);

export default ScheduleTimeHeader;
