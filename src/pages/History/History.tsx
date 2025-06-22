import { type HistoryItem, useHistoryStore } from './historyStore';
import styles from './history.module.css';
import file from '../../assets/file.svg';
import success from '../../assets/success.svg';
import notSuccess from '../../assets/not-success.svg';
import deleteIcon from '../../assets/delete.svg';
import ResultsPopup from './ResultsPopup';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';

const HistoryItem: React.FC<{ item: HistoryItem }> = ({ item }) => {
  const deleteItem = () => {
    useHistoryStore.getState().removeHistoryItem(item.id);
  };

  const [showPopup, setShowPopup] = useState(false);

  const handleItemClick = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <>
      <div className={styles.historyItemContainer}>
        <div
          className={`${styles.historyItem} ${item.success ? styles.clickable : ''}`}
          onClick={handleItemClick}
        >
          <div className={styles.historyItemFilename}>
            <img src={file} alt="file" />
            {item.filename}
          </div>

          <div className={styles.historyItemDate}>
            {item.date.toLocaleDateString()}
          </div>

          <div className={item.success ? '' : styles.pale}>
            Обработан успешно
            <img src={success} alt="success" />
          </div>

          <div className={item.success ? styles.pale : ''}>
            Не удалось обработать
            <img src={notSuccess} alt="not success" />
          </div>
        </div>

        <button className={styles.historyItemDelete} onClick={deleteItem}>
          <img src={deleteIcon} alt="delete" />
        </button>
      </div>

      {showPopup &&
        item.result &&
        createPortal(
          <ResultsPopup {...item.result} onClose={handleClosePopup} />,
          document.body
        )}
    </>
  );
};

export default function History() {
  const history = useHistoryStore(state => state.history);
  const navigate = useNavigate();

  return (
    <>
      <div className={styles.history}>
        {history.map(item => (
          <HistoryItem key={item.id} item={item} />
        ))}
      </div>

      <div className={styles.bottomButtons}>
        <button
          className={styles.new}
          onClick={() => {
            navigate('/generate');
          }}
        >
          Сгенерировать больше
        </button>

        <button
          className={styles.deleteAll}
          onClick={() => {
            useHistoryStore.getState().clearHistory();
          }}
        >
          Очистить все
        </button>
      </div>
    </>
  );
}
