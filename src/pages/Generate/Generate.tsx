import styles from './generate.module.css';
import { create } from 'zustand';
import { generateAndDownload } from './generating';
import type { GenerateState } from './generating';
import Spinner from '../shared/Spinner/Spinner';
import ProcessedFile from '../shared/ProcessedFile/ProcessedFile';

const useGenerateStore = create<{
  state: GenerateState;
  setState: (state: GenerateState) => void;
}>(set => ({
  state: null,
  setState: state => set({ state }),
}));

const Generate: React.FC = () => {
  const { state, setState } = useGenerateStore();

  const handleClear = () => {
    setState(null);
  };

  let button: React.ReactNode;

  if (state === null) {
    button = (
      <button
        className={styles.buttonStart}
        onClick={() => generateAndDownload(setState)}
      >
        Начать генерацию
      </button>
    );
  } else if (state === 'processing') {
    button = (
      <>
        <Spinner />
        <div>идет процесс генерации</div>
      </>
    );
  } else if (state === 'completed') {
    button = (
      <>
        <ProcessedFile name="Done!" clearCallback={handleClear} status="done" />
        <div>файл сгенерирован!</div>
      </>
    );
  } else if (state === 'error') {
    button = (
      <>
        <ProcessedFile
          name="Ошибка"
          clearCallback={handleClear}
          status="error"
        />
        <div className={styles.errorMessage}>упс, не то...</div>
      </>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.subheader}>
        Сгенерируйте готовый csv-файл нажатием одной кнопки
      </div>
      {button}
    </div>
  );
};

export default Generate;
