import React from 'react';
import { withBlockExtensions } from '@plone/volto/helpers/Extensions';
import SidebarPortal from '@plone/volto/components/manage/Sidebar/SidebarPortal';
import type { BlockEditProps } from '@plone/types';
import SponsorLevelBlockData from './Data';
import SponsorLevelBlockView from './View';

const SponsorLevelBlockEdit: React.FC<BlockEditProps> = (props) => {
  const { data, onChangeBlock, block, selected } = props;
  return (
    <>
      <SponsorLevelBlockView {...props} isEditMode />
      <SidebarPortal selected={selected}>
        <SponsorLevelBlockData
          {...props}
          data={data}
          block={block}
          onChangeBlock={onChangeBlock}
        />
      </SidebarPortal>
    </>
  );
};

export default withBlockExtensions(SponsorLevelBlockEdit);
