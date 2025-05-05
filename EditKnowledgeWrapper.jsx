/* istanbul ignore file */
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from '@americanexpress/one-app-router';
import styles from '../../../styles/editKnowledgeWrapper.scss';
import AdditionalKnowledgeCard from '../newSessionScreen/AdditionalKnowledgeCard';
import TextEditor from './TextEditor';

import { getAllCompanyKnowledge, getAllIndustryKnowledge, getAllPersonalKnowledge } from '../../../store/selectors/earningsCallTranscriptSelectors';

function EditKnowledgeWrapper() {
  const companyKnowledge = useSelector((state) => getAllCompanyKnowledge(state));
  const industryKnowledge = useSelector((state) => getAllIndustryKnowledge(state));
  const personalKnowledge = useSelector((state) => getAllPersonalKnowledge(state));
  const [latestItem, setLatestItem] = useState({
    context_id: '', context_title: '', context_type: '', context_content: '',
  });
  const [unSelectAllButtons, setUnSelectAllButtons] = useState({ context_type: '', toggle: false });

  const addUserSelectedButtons = (knowledgeItem) => {
    // When user click on + icon this condition works
    if (latestItem.context_type !== '' && knowledgeItem.context_type !== latestItem.context_type) {
      setUnSelectAllButtons({ context_type: latestItem.context_type, toggle: true });
    }
    setLatestItem(() => {
      // When user clicks on same button twice this condition works
      if (latestItem.context_id === knowledgeItem.context_id
        && latestItem.context_type === knowledgeItem.context_type) {
        return {
          context_id: '', context_title: '', context_type: knowledgeItem.context_type, context_content: '',
        };
      }
      return knowledgeItem;
    });
  };

  useEffect(() => {
  }, [companyKnowledge, industryKnowledge, personalKnowledge]);

  return (
    <div className={styles.page}>
      <div className={styles.knowledgeWrapper}>
        <div className={styles.headerWrapper}>
          <Link to="/" className={styles.overrideLink}>
            <button type="button" className={`${styles.backButton}`}>Back</button>
          </Link>
          <h3 className={styles.knowledgeHeader}>Knowledge</h3>
        </div>

        <AdditionalKnowledgeCard knowledgeType="company knowledge" knowledgeArray={companyKnowledge} isEditKnowledge={true} addUserSelectedButtons={addUserSelectedButtons} unSelectAllButtons={unSelectAllButtons} />
        <AdditionalKnowledgeCard knowledgeType="industry knowledge" knowledgeArray={industryKnowledge} isEditKnowledge={true} addUserSelectedButtons={addUserSelectedButtons} unSelectAllButtons={unSelectAllButtons} />
        <AdditionalKnowledgeCard knowledgeType="personal knowledge" knowledgeArray={personalKnowledge} isEditKnowledge={true} addUserSelectedButtons={addUserSelectedButtons} unSelectAllButtons={unSelectAllButtons} />
      </div>
      <div className={styles.textComponentHolder}>
        <TextEditor latestItem={latestItem} />
      </div>
    </div>
  );
}

export default EditKnowledgeWrapper;
