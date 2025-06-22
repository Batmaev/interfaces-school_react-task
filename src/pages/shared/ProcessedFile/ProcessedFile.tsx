import styles from './processedFile.module.css';
import ClearButton from '../clearButton/ClearButton';

const ProcessedFile: React.FC<{
  name: string;
  clearCallback: () => void;
  status: 'done' | 'selected' | 'error';
}> = ({ name, clearCallback, status = 'done' }) => {
  const statusClass =
    status === 'done'
      ? styles.processedFile
      : status === 'error'
        ? styles.erroredFile
        : styles.selectedFile;

  return (
    <div className={styles.selectedFileContainer}>
      <span className={statusClass}>{name}</span>
      <ClearButton clearCallback={clearCallback} />
    </div>
  );
};

export default ProcessedFile;
