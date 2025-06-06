/* istanbul ignore file */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import styles from '../../../styles/manageContext.scss';
import Knowledge from '../newSessionScreen/Knowledge';
import {
  setDocumentProcessingAlert,
  setUserSelectedDocumentsForChat,
  setLastestUploadedDocs,
  setRefressPreviousSession,
  setRefressCurrentSession,
} from '../../../store/actions/earningsCallTranscriptActions';
import {
  getUserSelectedDocumentForChat,
  getUserSelectedCompanyKnowledge,
  getUserSelectedIndustryKnowledge,
  getUserSelectedPersonalKnowledge,
  getSelectedChatDetails,
  getCurrentChatDetails,
  getEditContextButton,
  getCurrentSessionDetails,
  getUserId,
  getToggleProcessingBanner,
} from '../../../store/selectors/earningsCallTranscriptSelectors';
import { CONFIG } from '../../../config';

const ManageContext = () => {
  const [documents, setDocuments] = useState([]);
  const [knowledge, setKnowledge] = useState([]);
  const [chatName, setChatName] = useState('...');
  const selectedChat = useSelector((state) => getSelectedChatDetails(state));
  const selectedDocuments = useSelector((state) => getUserSelectedDocumentForChat(state));
  const seletedCompanyKnowldge = useSelector((state) => getUserSelectedCompanyKnowledge(state));
  const seletedIndustryKnowldge = useSelector((state) => getUserSelectedIndustryKnowledge(state));
  const seletedPersonalKnowldge = useSelector((state) => getUserSelectedPersonalKnowledge(state));
  const [showManageKnowledgeWindow, setShowManageKnowledgeWindow] = useState(false);
  const currentChatsArray = useSelector((state) => getCurrentChatDetails(state));
  const currentSessionDetails = useSelector((state) => getCurrentSessionDetails(state));
  const userId = useSelector((state) => getUserId(state));
  const showBanner = useSelector((state) => getToggleProcessingBanner(state));
  const isEditContextEnable = useSelector((state) => getEditContextButton(state));
  const dispatch = useDispatch();



  const removeDocument = async (fileIdRemove) => {
    try {
      const updatedDocuments = selectedDocuments.filter(
        (doc) => doc.file_id !== fileIdRemove
      );
      dispatch(setUserSelectedDocumentsForChat(updatedDocuments));
      const seletedContexts = [...seletedCompanyKnowldge,
        ...seletedIndustryKnowldge, ...seletedPersonalKnowldge];
      const seletedContextIds = seletedContexts.map((ctx) => ctx.context_id);
      const updatedFileIds = updatedDocuments.map((doc) => doc.file_id);
      const selectedFileIds = selectedDocuments.map((doc) => doc.file_id);
      const data = {
        user_id: userId,
        chat_id: selectedChat.chat_id,
        original_file_ids: selectedFileIds,
        files_selected: updatedFileIds,
        contexts_selected: seletedContextIds,
        industry_selected: 'Payments',
      };
      const res = await fetch(`${CONFIG.API_BASE_URL}/manageChatContext`, { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } });
      if (res.status === 200) {
        dispatch(setRefressCurrentSession(true));
        dispatch(setRefressPreviousSession(true));
      } else {
        toast.error('Something went wrong');
      }
    } catch (error) {
      toast.error('Something went wrong while opening chat components');
    }
  };

  useEffect(() => {
    console.log('selectedDocuments', selectedDocuments);
    setDocuments([...selectedDocuments || [],
    ]);
    setKnowledge([
      ...seletedCompanyKnowldge,
      ...seletedIndustryKnowldge,
      ...seletedPersonalKnowldge,
    ]);
    if (!showBanner && 'chat_id' in selectedChat) {
      setChatName(selectedChat.chat_name);
    } else {
      setChatName('...');
    }
  }, [selectedChat, currentChatsArray, selectedDocuments]);

  const openOrCloseManageKnowledgeWindow = (toggle) => {
    setShowManageKnowledgeWindow(toggle);
    dispatch(setLastestUploadedDocs(false));
    dispatch(setDocumentProcessingAlert({ show: false, message: '' }));
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <h4 className={styles.header}>Manage Context</h4>
        <button
          type="button"
          onClick={() => openOrCloseManageKnowledgeWindow(true)}
          className={styles.editKnowledgeButton}
          disabled={isEditContextEnable}
        >Edit Context
        </button>
        {showManageKnowledgeWindow && (
          <div className={styles.overlay}>
            <div className={styles.popup}>
              <Knowledge
                isUsedByManageContext={true}
                openOrCloseManageKnowledgeWindow={
                openOrCloseManageKnowledgeWindow
              }
              />
            </div>
          </div>
        )}
      </div>

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

      {knowledge.length > 0 && (
        <div className={styles.section}>
          <strong>Knowledge</strong>
          <div className={styles.contextContainer}>
            {knowledge.map((item) => (
              <button type="button" key={item.context_id} className={styles.button}>{item.context_title}</button>
            ))}
          </div>
        </div>
      )}

      <div className={styles.section}>
        <strong>Session</strong>
        <div>
          <button type="button" className={styles.sessionButton}>{chatName}</button>
        </div>
      </div>
    </div>
  );
};

export default ManageContext;
POST
/indexFile
Index File

Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "file_id": 1,
  "is_additional_file": false
}
Responses
Code	Description	Links
200	
Successful Response

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "status": "Success"
}
