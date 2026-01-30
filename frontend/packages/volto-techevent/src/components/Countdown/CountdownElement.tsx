import React from 'react';
import cx from 'classnames';
import { Container } from '@plone/components';

const CountdownElement: React.FC<{
  className: string;
  size: string;
  value: number;
  label: string;
}> = ({ className, value, label, size = 'l' }) => {
  const valueStr = value.toString().padStart(2, '0');
  return (
    <div className="countdown-element-wrapper">
      <Container className={cx('countdown-element', `size-${size}`, className)}>
        <div className="value">{valueStr}</div>
        <div className="label">{label}</div>
      </Container>
    </div>
  );
};

export default CountdownElement;
