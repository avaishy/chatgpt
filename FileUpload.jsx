/* istanbul ignore file */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from '../../../styles/fileUpload.scss';

function FileUpload({ toggleFileUploadComponent, handleFileUpload }) {
  const [companyName, setCompanyName] = useState('');
  const [date, setDate] = useState('');
  const [fileName, setFileName] = useState('');
  const [files, setFiles] = useState([]);

  const handleFileChange = (event) => {
    const selectedFiles = [...event.target.files];
    setFiles(selectedFiles);
    setFileName(selectedFiles[0].name);
  };

  return (
    <div className={styles.fileUploadComponent}>
      <div className={styles.headerContainer}>
        <div className={styles.header}>Upload File</div>
        <button type="button" onClick={() => toggleFileUploadComponent(false)} className={styles.closeButton}>
          close
        </button>
      </div>
      <div className={styles.body}>
        <div className={styles.inputContainer}>
          <div className={styles.fileUploadContainer}>

            <label htmlFor="upload-doc" className={`${styles.uploadLabel}`}>
              {files.length === 0
                ? (
                  <>
                    <span className={`${styles.uploadIcon}`}>
                      <svg viewBox="0 0 24 24" fill="black" width="24px" height="24px">
                        <path d="M5 20h14v-2H5v2zm7-16l-5.5 5.5 1.41 1.41L11 8.83V17h2V8.83l3.09 3.09 1.41-1.41L12 4z" />
                      </svg>
                    </span>
                    <span className={`${styles.fileUploadText}`}>Browse file to upload</span>
                    <input id="upload-doc" type="file" className={`${styles.fileInput}`} onChange={handleFileChange} />
                  </>
                )

                : (
                  <>{files.map((preview) => (
                    <div key={preview.name} className={styles.previewContainer}>
                      {preview.name}
                    </div>
                  ))}
                  </>
                )}
            </label>
          </div>
          <div style={{ display: 'flex', width: '100%' }}>
            <input className={styles.inputBox} placeholder="Company name" onChange={(e) => setCompanyName(e.target.value)} value={companyName} />
            <input className={styles.inputBox} type="date" placeholder="Enter Date" onChange={(e) => setDate(e.target.value)} value={date} />
            <input className={styles.inputBox} placeholder="File name" onChange={(e) => setFileName(e.target.value)} value={fileName} />
          </div>
          <button
            type="button"
            className={styles.uploadButton}
            onClick={() => handleFileUpload({
              fileInput: files,
              companyName,
              date,
              fileName,
            })}
            disabled={files.length === 0}
          >Upload
          </button>
        </div>
      </div>
    </div>
  );
}

FileUpload.propTypes = {
  toggleFileUploadComponent: PropTypes.func.isRequired,
  handleFileUpload: PropTypes.func.isRequired,
};

export default FileUpload;
