import { type ProcessingResult } from '../../History/historyStore';
import styles from './highlightList.module.css';

export default function HighlightList(result: ProcessingResult) {
  return (
    <>
      <Highlight
        value={result.total_spend_galactic.toFixed(2)}
        label="общие расходы в галактических кредитах"
      />
      <Highlight
        value={result.less_spent_civ}
        label="цивилизация с минимальными расходами"
      />
      <Highlight
        value={result.rows_affected}
        label="количество обработанных записей"
      />
      <Highlight
        value={formatDay(result.big_spent_at)}
        label="день года с максимальными расходами"
      />
      <Highlight
        value={formatDay(result.less_spent_at)}
        label="день года с минимальными расходами"
      />
      <Highlight
        value={result.big_spent_value}
        label="максимальная сумма расходов за день"
      />
      <Highlight
        value={result.less_spent_value}
        label="минимальная сумма расходов за день"
      />
      <Highlight
        value={result.average_spend_galactic.toFixed(2)}
        label="средние расходы в галактических кредитах"
      />
    </>
  );
}

const Highlight: React.FC<{ value: string | number; label: string }> = ({
  value,
  label,
}) => {
  return (
    <div className={styles.highlight}>
      <div className={styles.value}>{value}</div>
      <div className={styles.label}>{label}</div>
    </div>
  );
};

function formatDay(day: number) {
  const date = new Date(day * 24 * 60 * 60 * 1000);
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
}
