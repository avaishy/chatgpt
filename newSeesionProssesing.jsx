/* istanbul ignore file */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import styles from '../../../styles/FileProcessing.scss';
import { getUserId } from '../../../store/selectors/earningsCallTranscriptSelectors';

const NewSessionStatus = () => {
  const userId = useSelector((state) => getUserId(state));
  const useCase = 'Earnings Call Transcript';
  const [newSessionStatus, setNewSessionStatus] = useState([]);

  const formatTimeDuration = (duration) => {
    if (!duration) return '—';
    const [hours, minutes, rest] = duration.split(':');
    const seconds = Math.floor(Number.parseFloat(rest));
    return `${Number.parseInt(hours, 10)}h ${Number.parseInt(minutes, 10)}m ${seconds}s`;
  };
  const fetchNewSessionStatus = async () => {
    try {
      const response = await fetch('https://lumosusersessionmgmt-dev.aexp.com/getChatsCreationStatus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          use_case: useCase === 'earnings_call_transcript' ? 'Earnings Call Transcript' : useCase,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setNewSessionStatus(result);
      } else {
        toast.error('Invalid request. Please try again later');
      }
    } catch (error) {
      toast.error('Something went wrong while loading new session statuses. Please try again later');
    }
  };

  useEffect(() => {
    fetchNewSessionStatus();
  }, [userId]);

  return (
    <div className={`${styles.section}`}>
      <table className={styles.fileProcessingTable}>
        <thead>
          <tr>
            <th>Session Name</th>
            <th>Status</th>
            <th>Execution Time</th>
            <th>User ID</th>
          </tr>
        </thead>
        <tbody>
          {newSessionStatus.map((session) => (
            <tr key={`${session.session_name}-${session.status}-${session.duration}-${userId}`}>
              <td style={{ width: '40%' }}>{session.session_name}</td>
              <td style={{ width: '20%' }}>{session.status}</td>
              <td style={{ width: '20%' }}>{session.duration ? formatTimeDuration(session.duration) : '—'}</td>
              <td style={{ width: '20%' }}>{userId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NewSessionStatus;
