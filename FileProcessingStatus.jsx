import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import styles from '../../../styles/FileProcessing.scss';
import { getUserId } from '../../../store/selectors/earningsCallTranscriptSelectors';

const ProcessingStatus = () => {
  const userId = useSelector(getUserId);
  const [showSessionStatus, setShowSessionStatus] = useState(false);
  const [fileStatuses, setFileStatuses] = useState([]);
  const [sessionStatuses, setSessionStatuses] = useState([]);
  const [loading, setLoading] = useState(false);

  const useCase = 'Earnings Call Transcript';

  const formatTimeDuration = (duration) => {
    if (!duration) return '—';
    const [hours, minutes, rest] = duration.split(':');
    const seconds = Math.floor(Number.parseFloat(rest));
    return `${parseInt(hours, 10)}h ${parseInt(minutes, 10)}m ${seconds}s`;
  };

  const fetchFileStatuses = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://lumosusersessionmgmt-dev.aexp.com/getFilesFeatureOpsStats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ user_id: userId, use_case }),
      });

      if (response.ok) {
        const result = await response.json();
        setFileStatuses(result);
      } else {
        toast.error('Failed to fetch file statuses');
      }
    } catch (error) {
      toast.error('Error fetching file statuses');
    } finally {
      setLoading(false);
    }
  };

  const fetchSessionStatuses = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://lumosusersessionmgmt-dev.aexp.com/getChatsCreationStatus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ user_id: userId, use_case }),
      });

      if (response.ok) {
        const result = await response.json();
        setSessionStatuses(result);
      } else {
        toast.error('Failed to fetch session statuses');
      }
    } catch (error) {
      toast.error('Error fetching session statuses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    showSessionStatus ? fetchSessionStatuses() : fetchFileStatuses();
  }, [showSessionStatus, userId]);

  return (
    <div className={styles.section}>
      <div className={styles.statusHeader}>
        <div className={styles.toggleContainer}>
          <label className={styles.switch}>
            <input
              type="checkbox"
              checked={showSessionStatus}
              onChange={() => setShowSessionStatus((prev) => !prev)}
            />
            <span className={styles.slider}>
              {showSessionStatus ? 'Session Status' : 'File Status'}
            </span>
          </label>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className={styles.fileProcessingTable}>
          <thead>
            <tr>
              <th>{showSessionStatus ? 'Session Name' : 'File Name'}</th>
              <th>Status</th>
              <th>Execution Time</th>
              <th>User ID</th>
            </tr>
          </thead>
          <tbody>
            {(showSessionStatus ? sessionStatuses : fileStatuses).map((item) => (
              <tr
                key={`${item.session_name || item.file_name}-${item.status}-${item.duration}-${userId}`}
              >
                <td style={{ width: '40%' }}>{item.session_name || item.file_name}</td>
                <td style={{ width: '20%' }}>{item.status}</td>
                <td style={{ width: '20%' }}>
                  {item.duration ? formatTimeDuration(item.duration) : '—'}
                </td>
                <td style={{ width: '20%' }}>{userId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProcessingStatus;