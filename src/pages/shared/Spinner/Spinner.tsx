import styles from './spinner.module.css';
import spinner from '../../../assets/spinner.svg';

const Spinner: React.FC = () => {
  return (
    <div className={styles.spinnerContainer}>
      <img src={spinner} alt="spinner" />
    </div>
  );
};

export default Spinner;
