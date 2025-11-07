import React, { useState, useEffect } from 'react';
import cx from 'classnames';
import CountdownElements from './CountdownElements';

const Countdown: React.FC<{
  className: string;
  targetDate: string;
  displayFormat: string;
  size: string;
  hideAfterStart: boolean;
  hasSeparator: boolean;
}> = ({
  className,
  targetDate,
  size = 'l',
  displayFormat = 'ddhhmmss',
  hideAfterStart = true,
  hasSeparator = true,
}) => {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isFuture, setIsFuture] = useState(false);

  useEffect(() => {
    const second = 1000,
      minute = second * 60,
      hour = minute * 60,
      day = hour * 24;

    let countDown = new Date(targetDate).getTime();

    const interval = setInterval(() => {
      let now = new Date().getTime(),
        distance = countDown - now;
      if (distance <= 0) {
        setDays(0);
        setHours(0);
        setMinutes(0);
        setSeconds(0);
        setIsFuture(false);
      } else {
        setDays(Math.floor(distance / day));
        setHours(Math.floor((distance % day) / hour));
        setMinutes(Math.floor((distance % hour) / minute));
        setSeconds(Math.floor((distance % minute) / second));
        setIsFuture(true);
      }
    }, second);

    return () => clearInterval(interval);
  }, [targetDate]);
  return (
    (isFuture || !hideAfterStart) && (
      <CountdownElements
        className={cx('countdown-elements', className)}
        size={size}
        days={days}
        hours={hours}
        minutes={minutes}
        seconds={seconds}
        displayFormat={displayFormat}
        hasSeparator={hasSeparator}
      />
    )
  );
};

export default Countdown;
