import Image from 'next/image';
import { TableItem } from '../Table';
import styles from './Title.module.scss';

function Title() {
  return (
    <div className={styles.title}>
      <Image src="/thera-solutions-logo.png" alt="Logo Thera Solutions" width={111} height={54} />
      <h1 className={styles.h1}>Olá, Felipe!</h1>
    </div>
  );
}

export default Title;
