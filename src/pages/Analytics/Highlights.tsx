import React from 'react';
import styles from './highlights.module.css';
import { useCurrentFileStore } from './uploading';
import HighlightList from '../shared/HighlightList/HighlightList';

const Highlits: React.FC = () => {
  const currentFileStore = useCurrentFileStore();

  const result = currentFileStore.result;

  if (!result) {
    return (
      <div className={styles.promise}>
        Здесь
        <br />
        появятся хайлайты
      </div>
    );
  } else {
    return (
      <div className={styles.grid}>
        <HighlightList {...result} />
      </div>
    );
  }
};

export default Highlits;
