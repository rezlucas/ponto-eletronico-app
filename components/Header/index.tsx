'use client';

import React, { useState } from 'react';
import Buttons from '../Buttons';
import { TableItem } from '../Table';
import Timers from '../Timers';
import Title from '../Title';
import styles from './Header.module.scss';

function Header() {
  const [timesheet, setTimesheet] = useState<TableItem | undefined>(undefined);

  return (
    <section className={styles.wrapperheader}>
      <Title />
      <div className={styles.wrapper}>
        <Timers timesheet={timesheet} />
        <Buttons timeSheetId={timesheet?.id} setTimeSheet={setTimesheet} />
      </div>
    </section>
  );
}

export default Header;
