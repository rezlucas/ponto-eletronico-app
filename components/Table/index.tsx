'use client';

import ApiClient from '@/clients/api';
import dayjs from 'dayjs';
import { type } from 'os';
import { useEffect, useState } from 'react';
import styles from './Table.module.scss';
import duration from 'dayjs/plugin/duration';

export type TableItem = {
  id?: number;
  start?: string;
  startLunch?: string;
  endLunch?: string;
  end?: string;
};

function Table() {
  dayjs.extend(duration);

  const [items, setItems] = useState<TableItem[]>([]);

  useEffect(() => {
    const fetchTimesheets = async () => {
      const timeSheets = await ApiClient.getTimesheets();
      setItems(timeSheets);
    };
    fetchTimesheets();
  }, []);

  const timeWorked = (item: TableItem) => {
    const startTime = dayjs(item.start);
    const startLunchTime = dayjs(item.startLunch);
    const endLunchTime = dayjs(item.endLunch);
    const endTime = dayjs(item.end);

    if (!item.startLunch) {
      return '----';
    }

    if (!item.endLunch || !item.end) {
      const diff = startLunchTime.diff(startTime);
      return formatMilliseconds(diff);
    }

    const diff = startLunchTime.diff(startTime) + endTime.diff(endLunchTime);
    return formatMilliseconds(diff);
  };

  const formatMilliseconds = (milisseconds: number) => {
    return dayjs.duration(milisseconds).format('HH:mm:ss');
  };

  const formatTime = (time?: string) => {
    if (!time || time == '') {
      return '----';
    }

    return dayjs(time).format('HH:mm:ss');
  };

  return (
    <section>
      <table className={styles.recordingtable}>
        <thead>
          <tr>
            <th>Data</th>
            <th>Hora início</th>
            <th>Almoço início</th>
            <th>Almoço fim</th>
            <th>Hora fim</th>
            <th>Tempo</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{dayjs(item.start).format('DD/MM/YYYY')}</td>
              <td>{formatTime(item?.start)}</td>
              <td>{formatTime(item?.startLunch)}</td>
              <td>{formatTime(item?.endLunch)}</td>
              <td>{formatTime(item?.end)}</td>
              <td>{timeWorked(item)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default Table;
