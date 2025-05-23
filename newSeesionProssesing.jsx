import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import styles from '../../../styles/FileProcessing.scss';
import { getUserId } from '../../../store/selectors/earningsCallTranscriptSelectors';
import NewSessionStatus from './NewSessionStatus';

const FileProcessingStatus = () => {
  const userId = useSelector((state) => getUserId(state));
  const useCase = 'Earnings Call Transcript';
  const [fileStatuses, setFileStatuses] = useState([]);
  const [showNewSessionStatus, setShowNewSessionStatus] = useState(false);

  const formatTimeDuration = (duration) => {
    if (!duration) return '—';
    const [hours, minutes, rest] = duration.split(':');
    const seconds = Math.floor(Number.parseFloat(rest));
    return `${Number.parseInt(hours, 10)}h ${Number.parseInt(minutes, 10)}m ${seconds}s`;
  };

  const fetchFileStatuses = async () => {
    try {
      const response = await fetch('https://lumosusersessionmgmt-dev.aexp.com/getFilesFeatureOpsStats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          use_case: useCase,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setFileStatuses(result);
      } else {
        toast.error('Invalid request. Please try again later');
      }
    } catch (error) {
      toast.error('Something went wrong while loading file statuses. Please try again later');
    }
  };

  useEffect(() => {
    fetchFileStatuses();
  }, [userId]);

  const toggleShowReasoning = () => {
    if(showNewSessionStatus){
      setShowNewSessionStatus(false);

      return <NewSessionStatus />;
    }else{
      setShowNewSessionStatus(true);
    }
  }

  

  return (
    <div className={styles.section}>
      <div className={styles.statusHeader}>
        <div className={styles.toggleContainer}>
                                <label className={styles.switch}>
                                  <input
                                    type="checkbox"
                                    onChange={() => toggleShowReasoning}
                                  />
                                  <span className={styles.slider}>
                                    {showNewSessionStatus ? 'Session Status' : 'File Status'}
                                  </span>
                                </label>
                              </div>
      </div>
      <table className={styles.fileProcessingTable}>
        <thead>
          <tr>
            <th>File Name</th>
            <th>Status</th>
            <th>Execution Time</th>
            <th>User ID</th>
          </tr>
        </thead>
        <tbody>
          {fileStatuses.map((file) => (
            <tr key={`${file.file_name}-${file.status}-${file.duration}-${userId}`}>
              <td style={{ width: '40%' }}>{file.file_name}</td>
              <td style={{ width: '20%' }}>{file.status}</td>
              <td style={{ width: '20%' }}>{file.duration ? formatTimeDuration(file.duration) : '—'}</td>
              <td style={{ width: '20%' }}>{userId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FileProcessingStatus;
