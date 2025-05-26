/* istanbul ignore file */
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import styles from '../../../styles/sources.scss';
import {
  getChatMessages,
} from '../../../store/selectors/earningsCallTranscriptSelectors';

function Sources() {
  const [sources, setSources] = useState([]);
  const userMessages = useSelector((state) => getChatMessages(state));

  useEffect(() => {
    let latestSources = [];
    if (userMessages.length > 0) {
      const latestBotMessage = userMessages.filter((msg) => msg.role === 'llm').at(-1);
      if ('msg' in latestBotMessage) {
        latestSources = latestBotMessage.msg.sources;
      }
      setSources(latestSources);
    }
  }, [userMessages]);

  const cleanText = (text) => {
    try {
      const unwrapped = JSON.parse(text);
      return unwrapped.replace(/\\n/g, '\n');
    } catch (e) {
      return text.replace(/\\n/g, '\n');
    }
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>Sources</h3>
      {sources.map((source, index) => (
        <div key={source.llm_response_id} className={styles.source}>
          <p className={styles.title}>
            [{index + 1}] {source.source_title} {source.page}
          </p>
          <div className={styles.content}>
            <ReactMarkdown>{cleanText(source.source_content)}</ReactMarkdown>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Sources;
