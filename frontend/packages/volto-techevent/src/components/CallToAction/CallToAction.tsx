import React from 'react';
import cx from 'classnames';
import ConditionalLink from '@plone/volto/components/manage/ConditionalLink/ConditionalLink';

const CallToAction: React.FC<{
  className: string;
  label: string;
  size: string;
  item: Record<string, unknown>;
  isEditMode: boolean;
}> = ({ label, item, size = 'm', className = '', isEditMode = false }) => {
  const internalItem = item.href?.[0];
  return (
    <div className={cx('cta', `size-${size}`, className)}>
      <ConditionalLink
        className="cta-link"
        item={internalItem}
        condition={!isEditMode}
        openLinkInNewTab={item.openLinkInNewTab}
      >
        <span className={cx('cta-button', `size-${size}`)}>{label}</span>
      </ConditionalLink>
    </div>
  );
};

export default CallToAction;
