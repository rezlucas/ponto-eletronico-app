'use client';

import dayjs from 'dayjs';
import { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';
import { TableItem } from '../Table';
import styles from './Timers.module.scss';

type Props = {
  timesheet?: TableItem;
};

function Timers({ timesheet }: Props) {
  const currentDate = dayjs();

  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const timeWorked = useCallback((item: TableItem, currentDate: dayjs.Dayjs) => {
    const startTime = dayjs(item.start);
    const startLunchTime = dayjs(item.startLunch);
    const endLunchTime = dayjs(item.endLunch);
    const endTime = dayjs(item.end);

    if (!item.startLunch) {
      const diff = currentDate.diff(startTime);
      setTimeTracked(formatMilliseconds(diff));
      return;
    }

    if (!item.endLunch) {
      const diff = startLunchTime.diff(startTime);
      setTimeTracked(formatMilliseconds(diff));
      return;
    }

    if (!item.end) {
      const diff = startLunchTime.diff(startTime) + currentDate.diff(endLunchTime);
      setTimeTracked(formatMilliseconds(diff));
      return;
    }

    const diff = startLunchTime.diff(startTime) + endTime.diff(endLunchTime);
    setTimeTracked(formatMilliseconds(diff));
  }, []);

  useEffect(() => {
    timesheet && timeWorked(timesheet, dayjs());
  }, [timesheet, time, timeWorked]);

  const [timeTracked, setTimeTracked] = useState('');

  const formatMilliseconds = (milisseconds: number) => {
    return dayjs.duration(milisseconds).format('HH:mm:ss');
  };

  return (
    <div className={styles.wrappertimers}>
      <div className={styles.timers}>
        <div className={styles.iconlabel}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <strong className={styles.timer}>{currentDate.format('DD/MM/YYYY')}</strong>
        </div>
        <div className={styles.iconlabel}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <strong className={styles.timer} suppressHydrationWarning>
            {time}
          </strong>
        </div>
        <div className={styles.iconlabel}>
          <svg
            className={styles.yellowtimer}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17 13.5L12 12L8 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <strong className={styles.yellowtimer}>{timeTracked}</strong>
        </div>
      </div>
    </div>
  );
}

export default Timers;
