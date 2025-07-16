import React from 'react';
import cx from 'classnames';
import { Container } from '@plone/components';
import Schedule from '@plone-collective/volto-techevent/components/Schedule/Schedule';
import type { BlockViewProps } from '@plone/types';

const View: React.FC<BlockViewProps> = ({ data, items, className, style }) => {
  const { title } = data;
  return (
    <Container className={cx('block schedule', className)} style={style}>
      {title && <Container className="title">{title}</Container>}
      <Schedule
        filterByDay={data.filterByDay}
        displayDayIndex={data.displayDayIndex}
        isEditMode={data.isEditMode}
        items={items}
      />
    </Container>
  );
};

export default View;
