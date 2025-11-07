import React from 'react';
import cx from 'classnames';

const ParallaxImage = ({
  Image,
  href,
  speed = 0.3,
  maxOffset = 500,
  offsetY,
  className = '',
}) => {
  const translateY = Math.min(offsetY * speed, maxOffset);
  const img = href && href[0] ? href[0] : {};
  return (
    <Image
      className={cx('parallax-img', className)}
      item={
        img.image_scales
          ? {
              '@id': img['@id'],
              image_field: img.image_field,
              image_scales: img.image_scales,
            }
          : null
      }
      src={!img.image_scales ? img['@id'] : null}
      alt=""
      loading="lazy"
      responsive={true}
      style={{
        transform: `translate(0, calc(-50% + ${translateY}px))`,
      }}
    />
  );
};

export default ParallaxImage;
