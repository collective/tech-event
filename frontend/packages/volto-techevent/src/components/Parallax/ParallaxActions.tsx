import React from 'react';
import CallToAction from '@plone-collective/volto-techevent/components/CallToAction/CallToAction';

const ParallaxActions = ({ items, isEditMode }) => {
  return (
    items &&
    items.length > 0 && (
      <div className="parallax-cta">
        {items.map((item, idx) => {
          const internalItem = item.href?.[0];
          return (
            !item.hideButton && (
              <CallToAction
                key={idx}
                label={item.label}
                item={internalItem}
                isEditMode={isEditMode}
              />
            )
          );
        })}
      </div>
    )
  );
};

export default ParallaxActions;
