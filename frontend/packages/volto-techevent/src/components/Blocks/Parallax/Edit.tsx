import React from 'react';
import SidebarPortal from '@plone/volto/components/manage/Sidebar/SidebarPortal';
import { withBlockExtensions } from '@plone/volto/helpers/Extensions';
import type { BlockEditProps } from '@plone/types';
import ParallaxData from './Data';
import ParallaxView from './View';

const Edit: React.FC<BlockEditProps> = (props) => {
  const { data, block, onChangeBlock, selected } = props;

  return (
    <>
      {data.href ? (
        <ParallaxView {...props} isEditMode />
      ) : (
        <div className="parallax-placeholder">Select an image</div>
      )}
      <SidebarPortal selected={selected}>
        <ParallaxData
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
