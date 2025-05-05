/* istanbul ignore file */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import PropTypes from 'prop-types';
import styles from '../../../styles/textEditor.scss';
import { setAllCompanyKnowledge, setAllIndustryKnowledge, setAllPersonalKnowledge } from '../../../store/actions/earningsCallTranscriptActions';
import {
  getUseCase, getAllCompanyKnowledge, getAllIndustryKnowledge, getAllPersonalKnowledge, getUserId,
} from '../../../store/selectors/earningsCallTranscriptSelectors';

function TextEditor({ latestItem }) {
  const useCase = useSelector((state) => getUseCase(state));
  const dispatch = useDispatch();
  const userId = useSelector((state) => getUserId(state));
  const [contextTitle, setContextTitle] = useState(latestItem.context_title || '');
  const [contextContent, setContextContent] = useState(latestItem.context_content || '');
  const companyKnowledge = useSelector((state) => getAllCompanyKnowledge(state));
  const industryKnowledge = useSelector((state) => getAllIndustryKnowledge(state));
  const personalKnowledge = useSelector((state) => getAllPersonalKnowledge(state));
  const [titlePlaceHolder, setTitlePlaceholder] = useState('Company Title');
  const [textPlaceHolder, setTextPlaceholder] = useState('Company Context');

  useEffect(() => {
    if (latestItem.context_title === '' && latestItem.context_content === '' && latestItem.context_type !== '') {
      if (latestItem.context_type === 'company knowledge') {
        setTitlePlaceholder('Company Title');
        setTextPlaceholder('Company Context');
      }
      if (latestItem.context_type === 'personal knowledge') {
        setTitlePlaceholder('Personal Title');
        setTextPlaceholder('Personal Context');
      }
      if (latestItem.context_type === 'industry knowledge') {
        setTitlePlaceholder('Industry Title');
        setTextPlaceholder('Industry Context');
      }
    }
    setContextTitle(latestItem.context_title);
    setContextContent(latestItem.context_content);
  }, [latestItem]);

  const createOrEditKnowledge = async () => {
    let localUseCase = null;
    let toastMessage = 'Successfully Created';
    if (useCase === 'earnings_call_transcript') {
      localUseCase = 'Earnings Call Transcript';
    }
    const data = {
      user_id: userId,
      use_case: localUseCase,
      context_title: contextTitle,
      context_type: latestItem.context_type,
      context_content: contextContent,
    };
    let url = 'https://lumosusersessionmgmt-dev.aexp.com/addUserContext';
    if (latestItem.context_id !== '') {
      data.context_id = latestItem.context_id;
      toastMessage = 'Successfully Modified';
      url = 'https://lumosusersessionmgmt-dev.aexp.com/updateUserContext';
    }
    try {
      const res = await fetch(url, { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } });
      if (res.ok) {
        toast.success(toastMessage);
        const result = await res.json();

        const updateKnowledgeArray = (array, newItem) => {
          const index = array.findIndex((item) => item.context_id === newItem.context_id);
          if (index !== -1) {
            return array.map((item, i) => (i === index ? newItem : item));
          }
          return [...array, newItem];
        };

        if (result.context_type === 'personal knowledge') {
          const perosnalData = updateKnowledgeArray(personalKnowledge, result);
          dispatch(setAllPersonalKnowledge(perosnalData));
        }
        if (result.context_type === 'industry knowledge') {
          const industryData = updateKnowledgeArray(industryKnowledge, result);
          dispatch(setAllIndustryKnowledge(industryData));
        }
        if (result.context_type === 'company knowledge') {
          const companyData = updateKnowledgeArray(companyKnowledge, result);
          dispatch(setAllCompanyKnowledge(companyData));
        }
      }
    } catch (error) { toast.error(`Something went wrong: ${error}`); }
  };

  const deleteKnowledge = async () => {
    try {
      const res = await fetch(`https://lumosusersessionmgmt-dev.aexp.com/deleteUserContext/${latestItem.context_id}`,
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        });

      if (res.ok) {
        toast.success('Successfully Deleted');
        const result = await res.json();

        if (latestItem.context_type === 'personal knowledge') {
          const data = personalKnowledge.filter((item) => item.context_id !== result.context_id);
          dispatch(setAllPersonalKnowledge(data));
        }

        if (latestItem.context_type === 'industry knowledge') {
          const data = industryKnowledge.filter((item) => item.context_id !== result.context_id);
          dispatch(setAllIndustryKnowledge(data));
        }

        if (latestItem.context_type === 'company knowledge') {
          const data = companyKnowledge.filter((item) => item.context_id !== result.context_id);
          dispatch(setAllCompanyKnowledge(data));
        }
        setContextTitle('');
        setContextContent('');
      }
    } catch (error) {
      toast.error(`Something went wrong: ${error}`);
    }
  };

  return (
    <div className={styles.textAreaWrapper}>
      <input
        className={styles.inputForTitle}
        placeholder={titlePlaceHolder}
        value={contextTitle}
        onChange={(e) => setContextTitle(e.target.value)}
      />
      <textarea
        className={styles.textArea}
        placeholder={textPlaceHolder}
        value={contextContent}
        onChange={(e) => setContextContent(e.target.value)}
      />
      <div className={styles.buttonContainer}>
        <button type="button" className={styles.saveButton} onClick={createOrEditKnowledge} disabled={!(contextContent !== '' && contextTitle !== '')}>Save</button>
        <button type="button" className={styles.deleteButton} disabled={latestItem.context_id === ''} onClick={deleteKnowledge}>Delete</button>
      </div>
    </div>
  );
}

TextEditor.propTypes = {
  latestItem: PropTypes.shape({
    context_id: PropTypes.string,
    context_title: PropTypes.string,
    context_content: PropTypes.string,
    context_type: PropTypes.string,
  }).isRequired,
};

export default TextEditor;
