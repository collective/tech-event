import React from 'react';
import type { BlockViewProps } from '@plone/types';
import DefaultView from './DefaultView';
import { useEventSettings } from '@plone-collective/volto-techevent/hooks/useEventSettings';
import { useSchedule } from '@plone-collective/volto-techevent/hooks/useSchedule';

const View: React.FC<BlockViewProps> = (props) => {
  const { data, isEditMode } = props;
  const eventRoot = useEventSettings()?.eventRoot;
  // Use hook only if eventRoot exists
  const { items } = useSchedule(eventRoot ?? '');
  return (
    <>
      {items && (
        <DefaultView
          data={data}
          isEditMode={isEditMode}
          items={items}
          {...props}
        />
      )}
    </>
  );
};

export default View;
