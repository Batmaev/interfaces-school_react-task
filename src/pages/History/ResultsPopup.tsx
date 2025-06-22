import styles from './resultsPopup.module.css';
import { type ProcessingResult } from './historyStore';
import HighlightList from '../shared/HighlightList/HighlightList';
import ClearButton from '../shared/clearButton/ClearButton';

interface ResultsPopupProps extends ProcessingResult {
  onClose: () => void;
}

export default function ResultsPopup({
  onClose,
  ...result
}: ResultsPopupProps) {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.resultsPopupContainer} onClick={handleBackdropClick}>
      <div className={styles.resultsAndCloseButton}>
        <div className={styles.closeButton}>
          <ClearButton clearCallback={onClose} />
        </div>
        <div className={styles.resultsPopup}>
          <HighlightList {...result} />
        </div>
      </div>
    </div>
  );
}
