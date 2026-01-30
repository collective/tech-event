import React from 'react';
import { BlockWrapper } from '@kitconcept/volto-bm3-compat';
import Parallax from '@plone-collective/volto-techevent/components/Parallax/Parallax';
import type { BlockViewProps } from '@plone/types';

const LegacyWrapper: React.FC<BlockViewProps> = ({ children }) => {
  return <>{children}</>;
};

const View: React.FC<BlockViewProps> = (props) => {
  const { data, isEditMode } = props;
  const { title, description, href, items, overlay, styles } = data;
  return (
    <BlockWrapper
      {...props}
      ExtraWrapper={LegacyWrapper}
      data={{ ...props.data, align: 'full' }}
    >
      <Parallax
        title={title}
        description={description}
        href={href}
        items={items}
        overlay={overlay}
        height={styles?.height}
        isEditMode={isEditMode}
      />
    </BlockWrapper>
  );
};

export default View;
