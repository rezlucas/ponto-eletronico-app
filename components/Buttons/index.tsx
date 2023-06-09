'use client';

import ApiClient from '@/clients/api';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { TableItem } from '../Table';
import styles from './Buttons.module.scss';

type Props = {
  timeSheetId: number | undefined;
  setTimeSheet: React.Dispatch<React.SetStateAction<TableItem | undefined>>;
};

function Buttons(props: Props) {
  const [isButton1Active, setButton1Active] = useState(false);
  const [isButton2Active, setButton2Active] = useState(false);
  const [isButton3Active, setButton3Active] = useState(false);
  const [isButton4Active, setButton4Active] = useState(false);

  useEffect(() => {
    const checkTimesheetToday = async () => {
      const timesheetForToday = await ApiClient.getTimesheetForToday();
      setButton1Active(!timesheetForToday);
      if(timesheetForToday){
        props.setTimeSheet(timesheetForToday);

        if(!timesheetForToday.startLunch){
          setButton2Active(true);
          return
        }
        if(!timesheetForToday.endLunch){
          setButton3Active(true);
          return
        }
        if(!timesheetForToday.end){
          setButton4Active(true);
          return
        }
      }
    }
    checkTimesheetToday();
  }, []);

  const handleButton1Click = () => {
    setButton1Active(false);
    setButton2Active(true);
  };

  const handleButton2Click = () => {
    setButton2Active(false);
    setButton3Active(true);
  };

  const handleButton3Click = () => {
    setButton3Active(false);
    setButton4Active(true);
  };

  const handleButton4Click = () => {
    setButton4Active(false);
  };

  const createTimesheet = async () => {
    handleButton1Click();
    const timeSheet = await ApiClient.createTimesheet();
    props.setTimeSheet((prevState) => ({
      ...prevState,
      id: timeSheet.id,
    }));
    //Usando tempo atual, pois o horário da API está com 3 horas a menos
    props.setTimeSheet((prevState) => ({
      ...prevState,
      start: dayjs().toISOString(),
    }));
  };

  const startLunch = async () => {
    handleButton2Click();
    props.timeSheetId && (await ApiClient.updateTimesheet(props.timeSheetId, 'startLunch'));
    props.setTimeSheet((prevState) => ({
      ...prevState,
      startLunch: dayjs().toISOString(),
    }));
  };
  const endLunch = async () => {
    handleButton3Click();
    props.timeSheetId && (await ApiClient.updateTimesheet(props.timeSheetId, 'endLunch'));
    props.setTimeSheet((prevState) => ({
      ...prevState,
      endLunch: dayjs().toISOString(),
    }));
  };
  const endDay = async () => {
    handleButton4Click();
    props.timeSheetId && (await ApiClient.updateTimesheet(props.timeSheetId, 'end'));
    props.setTimeSheet((prevState) => ({
      ...prevState,
      end: dayjs().toISOString(),
    }));
    //To Do, adicionar esse objeto no estado da table
  };

  return (
    <div className={styles.wrapperbuttons}>
      <div className={styles.recordingbuttons}>
        <button onClick={createTimesheet} disabled={!isButton1Active}>
          Cheguei
        </button>
        <button onClick={startLunch} disabled={!isButton2Active}>
          Fui almoçar
        </button>
        <button onClick={endLunch} disabled={!isButton3Active}>
          Voltei
        </button>
        <button onClick={endDay} disabled={!isButton4Active}>
          Fui
        </button>
      </div>
    </div>
  );
}

export default Buttons;
