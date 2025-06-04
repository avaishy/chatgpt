/* istanbul ignore file */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styles from '../../../styles/FileProcessing.scss';
import { getUserId } from '../../../store/selectors/earningsCallTranscriptSelectors';

const ProcessingStatus = () => {
  const userId = useSelector(getUserId);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchFileStats = async () => {
      try {
        const response = await fetch('https://lumosusersessionmgmt-dev.aexp.com/getFilesStats', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            user_id: userId,
            use_case: 'Earnings Call Transcript',
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        const formattedRows = data.map((item, index) => ({
          upload_time: item.crt_ts,
          name: item.file_name,
          is_main_file: item.is_main_file ? 'Yes' : 'No',
          file_indexing: item.indexing_status || 'NA',
          answer_generation: item.chats_creation_status || 'NA',
          execution_time: formatDuration(item.duration),
          user_id: userId,
          id: `${item.file_name}-${index}`,
        }));

        setRows(formattedRows);
      } catch (error) {
        console.error('Error fetching file stats:', error);
      }
    };

    fetchFileStats();
  }, [userId]);

  const formatDuration = (durationStr) => {
    if (!durationStr) return 'NA';
    const [hours, minutes, seconds] = durationStr.split(':');
    const formatted =
      (parseInt(hours) > 0 ? `${parseInt(hours)}h ` : '') +
      (parseInt(minutes) > 0 ? `${parseInt(minutes)}m ` : '') +
      `${Math.floor(parseFloat(seconds))}s`;
    return formatted;
  };

  return (
    <div className={styles.section}>
      <table className={styles.fileProcessingTable}>
        <thead>
          <tr>
            <th style={{ width: '14%' }}>Uploaded Time</th>
            <th style={{ width: '16%' }}>Name</th>
            <th style={{ width: '14%' }}>Is Main File</th>
            <th style={{ width: '14%' }}>File Indexing</th>
            <th style={{ width: '14%' }}>Answer Generation</th>
            <th style={{ width: '14%' }}>Execution Time</th>
            <th style={{ width: '14%' }}>User ID</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((item) => (
            <tr key={item.id}>
              <td>{item.upload_time}</td>
              <td>{item.name}</td>
              <td>{item.is_main_file}</td>
              <td>{item.file_indexing}</td>
              <td>{item.answer_generation}</td>
              <td>{item.execution_time}</td>
              <td>{item.user_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProcessingStatus;