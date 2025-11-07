import React from 'react';
import SidebarPortal from '@plone/volto/components/manage/Sidebar/SidebarPortal';
import { withBlockExtensions } from '@plone/volto/helpers/Extensions';
import type { BlockEditProps } from '@plone/types';
import CountdownData from './Data';
import CountdownView from './View';

const Edit: React.FC<BlockEditProps> = (props) => {
  const { data, block, onChangeBlock, selected } = props;

  return (
    <>
      <CountdownView {...props} isEditMode />
      <SidebarPortal selected={selected}>
        <CountdownData
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
