/* istanbul ignore file */
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import styles from '../../../styles/FileProcessing.scss';
import { getUserId } from '../../../store/selectors/earningsCallTranscriptSelectors';

const ProcessingStatus = () => {
  const userId = useSelector(getUserId);
  const [allStatuses, setAllStatuses] = useState([]);
  const [taskFilter, setTaskFilter] = useState('Indexing');
  const [loading, setLoading] = useState(false);

  const useCase = 'Earnings Call Transcript';

  const formatTimeDuration = (duration) => {
    if (!duration) return '—';
    const [hours, minutes, rest] = duration.split(':');
    const seconds = Math.floor(Number.parseFloat(rest));
    return `${parseInt(hours, 10)}h ${parseInt(minutes, 10)}m ${seconds}s`;
  };

  const fetchStatuses = useCallback(async () => {
    setLoading(true);
    try {
      const [fileRes, sessionRes] = await Promise.all([
        fetch('https://lumosusersessionmgmt-dev.aexp.com/getFilesFeatureOpsStats', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            user_id: userId,
            use_case: useCase,
          }),
        }),
        fetch('https://lumosusersessionmgmt-dev.aexp.com/getChatsCreationStatus', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            user_id: userId,
            use_case: useCase,
          }),
        }),
      ]);

      if (!fileRes.ok || !sessionRes.ok) {
        throw new Error('Failed to fetch one or both statuses');
      }

      const [fileStatuses, sessionStatuses] = await Promise.all([
        fileRes.json(),
        sessionRes.json(),
      ]);

      const formattedFiles = fileStatuses.map((item) => ({
        task: 'Indexing',
        name: item.file_name,
        status: item.status,
        duration: item.duration,
      }));

      const formattedSessions = sessionStatuses.map((item) => ({
        task: 'Pre-summarized',
        name: item.session_name,
        status: item.status,
        duration: item.duration,
      }));

      setAllStatuses([...formattedFiles, ...formattedSessions]);
    } catch (error) {
      toast.error('Error fetching statuses');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchStatuses();
    }
  }, [userId, fetchStatuses]);

  // useMemo to compute filtered data only when dependencies change
  const filteredStatuses = useMemo(() => {
    if (taskFilter === 'All') return allStatuses;
    return allStatuses.filter((item) => item.task === taskFilter);
  }, [allStatuses, taskFilter]);

  return (
    <div className={styles.section}>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className={styles.fileProcessingTable}>
          <thead>
            <tr>
              <th><div className={styles.toggleContainer}>
          <select
            value={taskFilter}
            onChange={(e) => setTaskFilter(e.target.value)}
            className={styles.dropdown}
          >
            <option value="All">All</option>
            <option value="Indexing">Indexing</option>
            <option value="Pre-summarized">Pre-summarized chats</option>
          </select>
        </div></th>
              <th>Name</th>
              <th>Status</th>
              <th>Execution Time</th>
              <th>User ID</th>
            </tr>
          </thead>
          <tbody>
            {filteredStatuses.map((item, idx) => (
              <tr key={`${item.name}-${item.status}-${idx}`}>
                <td style={{ width: '20%' }}>{item.task}</td>
                <td style={{ width: '20%' }}>{item.name}</td>
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
