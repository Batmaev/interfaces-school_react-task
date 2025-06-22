import styles from './clearButton.module.css';
import clearFile from '../../../assets/clearFile.svg';

export default function ClearButton({
  clearCallback,
}: {
  clearCallback: () => void;
}) {
  return (
    <button className={styles.clearFileButton} onClick={clearCallback}>
      <img src={clearFile} alt="clear" />
    </button>
  );
}
