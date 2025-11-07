import React from 'react';

export const DemoContainer: React.FC<
  React.PropsWithChildren<{
    width?: number | string;
    height?: number | string;
    maxWidth?: number | string;
    style?: React.CSSProperties;
  }>
> = ({
  width = 'var(--default-container-width)',
  height = 640,
  maxWidth = '100%',
  style,
  children,
}) => {
  return (
    <div
      style={{
        width,
        height,
        maxWidth,
        padding: '10px',
        margin: '60px auto',
        border: '1px solid #e5e7eb',
        borderRadius: 8,
        overflow: 'hidden',
        background: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        ...style,
      }}
    >
      {children}
    </div>
  );
};
