import React from 'react';
import cx from 'classnames';
import { Container } from '@plone/components';
import { FormattedMessage } from 'react-intl';
import CountdownElement from './CountdownElement';

const COUNTDOWN_ELEMENTS: Record<
  string,
  { displayHours: boolean; displayMinutes: boolean; displaySeconds: boolean }
> = {
  dd: { displayHours: false, displayMinutes: false, displaySeconds: false },
  ddhh: { displayHours: true, displayMinutes: false, displaySeconds: false },
  ddhhmm: { displayHours: true, displayMinutes: true, displaySeconds: false },
  ddhhmmss: { displayHours: true, displayMinutes: true, displaySeconds: true },
};

const CountdownElements: React.FC<{
  className: string;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  size: string;
  displayFormat: string;
  hasSeparator: boolean;
}> = ({
  className,
  days,
  hours,
  minutes,
  seconds,
  size = 'l',
  displayFormat = 'ddhhmmss',
  hasSeparator,
}) => {
  const { displayHours, displayMinutes, displaySeconds } = COUNTDOWN_ELEMENTS[
    displayFormat
  ] || {
    displayHours: true,
    displayMinutes: true,
    displaySeconds: true,
  };
  return (
    <Container
      className={cx(
        'countdown-elements',
        `size-${size}`,
        hasSeparator ? 'has-separator' : '',
        className,
      )}
    >
      <CountdownElement
        className={`days`}
        size={size}
        value={days}
        label={<FormattedMessage id="days" defaultMessage="days" />}
      />
      {displayHours && (
        <CountdownElement
          className={`hours`}
          size={size}
          value={hours}
          label={<FormattedMessage id="hours" defaultMessage="hours" />}
        />
      )}
      {displayMinutes && (
        <CountdownElement
          className={`minutes`}
          size={size}
          value={minutes}
          label={<FormattedMessage id="minutes" defaultMessage="minutes" />}
        />
      )}
      {displaySeconds && (
        <CountdownElement
          className={`seconds`}
          size={size}
          value={seconds}
          label={<FormattedMessage id="seconds" defaultMessage="seconds" />}
        />
      )}
    </Container>
  );
};

export default CountdownElements;
