import React, { useState, useRef, useEffect } from 'react';
import cx from 'classnames';
import config from '@plone/volto/registry';
import ParallaxActions from '@plone-collective/volto-techevent/components/Parallax/ParallaxActions';
import ParallaxImage from '@plone-collective/volto-techevent/components/Parallax/ParallaxImage';

const Parallax: React.FC<{
  title: string;
  description: string;
  href: string;
  items: Record<string, unknown>[];
  overlay: string;
  height: string;
  isEditMode: boolean;
  className: string;
}> = ({
  title,
  description,
  href,
  items,
  overlay = 'full',
  isEditMode,
  height = 'l',
  className = '',
}) => {
  const wrapperRef = useRef(null);
  const [offsetY, setOffsetY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [startScrollY, setStartScrollY] = useState(null);
  const [hasContent, setHasContent] = useState(false);
  const [hasDescription, setHasDescription] = useState(false);
  const Image = config.getComponent('Image').component;

  const hasRichText = (value) => {
    if (!value || typeof value.data !== 'string') return false;
    const plain = value.data.replace('<p></p>', '');
    return plain.length > 0;
  };

  useEffect(() => {
    const hasText = hasRichText(description);
    const contentExists = !!title || hasText;

    setHasContent(contentExists);
    setHasDescription(hasText);
  }, [title, description]);

  useEffect(() => {
    const currentRef = wrapperRef.current;
    const observer = new IntersectionObserver(
      ([entry], obs) => {
        if (entry.isIntersecting) {
          setStartScrollY((prev) => {
            if (prev === null) {
              return window.scrollY;
            }
            return prev;
          });
          setIsVisible(true);
          obs.disconnect();
        }
      },
      {
        threshold: 0.1,
      },
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  useEffect(() => {
    let animationFrameId;

    const updateOffset = () => {
      if (isVisible && startScrollY !== null) {
        const distance = window.scrollY - startScrollY;
        setOffsetY(distance > 0 ? distance : 0);
      }
      animationFrameId = requestAnimationFrame(updateOffset);
    };

    animationFrameId = requestAnimationFrame(updateOffset);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isVisible, startScrollY]);

  if (!isEditMode && !href) return null;

  return (
    <div className={cx('parallax-wrapper', `height-${height}`)}>
      <div ref={wrapperRef} className={cx('parallax-wrapperRef')}>
        {href && (
          <>
            <ParallaxImage Image={Image} href={href} offsetY={offsetY} />
            <div className="transparencyLayer" />
            <div className="parallax-content">
              <div
                className={cx('box', overlay, {
                  'has-content': hasContent,
                })}
              >
                {title && <h2 className="parallax-title">{title}</h2>}
                {hasDescription && (
                  <div
                    className="parallax-description"
                    dangerouslySetInnerHTML={{ __html: description.data }}
                  />
                )}
                <ParallaxActions items={items} isEditMode={isEditMode} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Parallax;
