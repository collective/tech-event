import React from 'react';
import SidebarPortal from '@plone/volto/components/manage/Sidebar/SidebarPortal';
import { withBlockExtensions } from '@plone/volto/helpers/Extensions';
import type { BlockEditProps } from '@plone/types';
import LevelComparisonData from './Data';
import LevelComparisonView from './View';

const Edit: React.FC<BlockEditProps> = (props) => {
  const { data, block, onChangeBlock, selected } = props;
  return (
    <>
      <LevelComparisonView {...props} isEditMode />
      <SidebarPortal selected={selected}>
        <LevelComparisonData
          {...props}
          data={data}
          block={block}
          onChangeBlock={onChangeBlock}
        />
      </SidebarPortal>
    </>
  );
};

export default withBlockExtensions(Edit);
