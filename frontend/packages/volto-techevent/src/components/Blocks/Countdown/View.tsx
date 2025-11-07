import React from 'react';
import cx from 'classnames';
import { BlockWrapper } from '@kitconcept/volto-bm3-compat';
import { Container } from '@plone/components';
import { useEventSettings } from '@plone-collective/volto-techevent/hooks/useEventSettings';
import Countdown from '@plone-collective/volto-techevent/components/Countdown/Countdown';
import type { BlockViewProps } from '@plone/types';

const LegacyWrapper: React.FC<BlockViewProps> = ({ children }) => {
  return <div className="countdown-wrapper">{children}</div>;
};

const View: React.FC<BlockViewProps> = (props) => {
  const { data } = props;
  const eventData = useEventSettings()?.data;
  const start = eventData?.start;
  const size = data.styles?.size || 'l';
  return (
    <BlockWrapper
      {...props}
      ExtraWrapper={LegacyWrapper}
      data={{ ...props.data }}
    >
      <Container className={'countdown'}>
        {data.title && (
          <p className={cx('countdown-title', `size-${size}`)}>{data.title}</p>
        )}
        <Countdown
          targetDate={start}
          displayFormat={data.displayFormat}
          size={size}
          hideAfterStart={data.hideAfterStart}
          hasSeparator={data.hasSeparator}
        />
      </Container>
    </BlockWrapper>
  );
};

export default View;
