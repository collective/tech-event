import React from 'react';
import cx from 'classnames';
import { Container } from '@plone/components';
import Schedule from '@plone-collective/volto-techevent/components/Schedule/Schedule';
import type { BlockViewProps } from '@plone/types';
import type { DaySchedule } from '@plone-collective/volto-techevent/types/schedule';

interface ScheduleViewProps extends BlockViewProps {
  items?: DaySchedule[];
}

const View: React.FC<ScheduleViewProps> = ({
  data,
  items,
  className,
  style,
  isEditMode,
}) => {
  const title = data.title as string | undefined;
  return (
    <Container className={cx('block schedule', className)} style={style}>
      {title && <Container className="title">{title}</Container>}
      <Schedule
        filterByDay={data.filterByDay}
        displayDayIndex={data.displayDayIndex}
        isEditMode={Boolean(isEditMode || data.isEditMode)}
        items={items}
      />
    </Container>
  );
};

export default View;
