 {documents.length > 0 && (
      <div className={styles.sectionDocument}>
        <strong>Documents</strong>
        <div className={styles.filesContainer}>
          {selectedDocuments.map((doc) => {
            const fileName = doc.additional_info.fileName || doc.file_name;
            const truncatedName = fileName.length > 20 ? `${fileName.slice(0, 20)}...` : fileName;

            return (
              <div key={doc.file_id} className={styles.documentWrapper}>
                <button type="button" className={styles.button}>
                  {truncatedName}
                </button>
                {doc.file_name !== currentSessionDetails.session_name && showBanner === false && (
                <button
                  type="button"
                  className={styles.removeButton}
                  title="Remove Document"
                  aria-label={`Remove ${doc.file_name}`}
                  onClick={() => removeDocument(doc.file_id)}
                >
                  x
                </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
      )}
