import Header from '@/components/Header';
import Table, { TableItem } from '@/components/Table';
import Image from 'next/image';
import { useState } from 'react';
import styles from './page.module.scss';

export default function Home() {
  return (
    <main className={styles.main}>
      <Header />
      <Table />
    </main>
  );
}
