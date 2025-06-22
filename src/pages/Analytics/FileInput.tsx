import React, { useCallback } from 'react';
import styles from './fileInput.module.css';
import { useCurrentFileStore, uploadFile } from './uploading';
import Spinner from '../shared/Spinner/Spinner';
import ProcessedFile from '../shared/ProcessedFile/ProcessedFile';

const FileInput: React.FC = () => {
  const currentFileStore = useCurrentFileStore();

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0] || null;
      if (selectedFile) {
        currentFileStore.setFile(selectedFile);
      }
    },
    [currentFileStore]
  );

  const handleClearFile = useCallback(() => {
    currentFileStore.clearFile();
  }, [currentFileStore]);

  const handleSubmit = useCallback(async () => {
    if (currentFileStore.file) {
      await uploadFile(currentFileStore.file, currentFileStore);
    }
  }, [currentFileStore.file]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile && droppedFile.type === 'text/csv') {
        currentFileStore.setFile(droppedFile);
      }
    },
    [currentFileStore.setFile]
  );

  const subheader = (
    <div className={styles.subheader}>
      Загрузите <strong>csv</strong> файл и получите{' '}
      <strong>полную информацию</strong> о нём за сверхнизкое время
    </div>
  );

  if (currentFileStore.status === null) {
    return (
      <div className={styles.loadDialog}>
        {subheader}

        <div
          className={styles.upload}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="fileInput"
            className={styles.fileInput}
            onChange={handleFileChange}
            accept=".csv"
          />
          <label htmlFor="fileInput" className={styles.fileLabel}>
            Загрузить файл
          </label>
          <div>или перетащите сюда</div>
        </div>

        <button className={styles.uploadButton} disabled>
          Отправить
        </button>
      </div>
    );
  }

  if (currentFileStore.status === 'selected') {
    const name = currentFileStore.file?.name || '';
    return (
      <div className={styles.loadDialog}>
        {subheader}

        <div
          className={styles.uploaded}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <ProcessedFile
            name={name}
            clearCallback={handleClearFile}
            status="selected"
          />
          <div>файл загружен!</div>
        </div>

        <button className={styles.uploadButton} onClick={handleSubmit}>
          Отправить
        </button>
      </div>
    );
  }

  if (currentFileStore.status === 'processing') {
    return (
      <div className={styles.loadDialog}>
        {subheader}

        <div className={styles.uploaded}>
          <Spinner />
          <div>идет парсинг файла</div>
        </div>
      </div>
    );
  }

  if (currentFileStore.status === 'completed') {
    const name = currentFileStore.file?.name || '';
    return (
      <div className={styles.loadDialog}>
        {subheader}

        <div className={styles.uploaded}>
          <ProcessedFile
            name={name}
            clearCallback={handleClearFile}
            status="done"
          />
          <div>готово!</div>
        </div>
      </div>
    );
  }

  if (currentFileStore.status === 'error') {
    const name = currentFileStore.file?.name || '';
    return (
      <div className={styles.loadDialog}>
        {subheader}

        <div className={styles.errored}>
          <ProcessedFile
            name={name}
            clearCallback={handleClearFile}
            status="error"
          />
          <div className={styles.errorMessage}>упс, не то...</div>
        </div>
      </div>
    );
  }
};

export default FileInput;
