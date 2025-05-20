/* istanbul ignore file */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from '../../../styles/manageContext.scss';
import Knowledge from '../newSessionScreen/Knowledge';
import { setDocumentProcessingAlert,setUserSelectedDocumentsForChat,setCurrentSessionDetails } from '../../../store/actions/earningsCallTranscriptActions';
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
} from '../../../store/selectors/earningsCallTranscriptSelectors';

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
    
  
  
  const isEditContextEnable = useSelector((state) => getEditContextButton(state));
  const dispatch = useDispatch();

  useEffect(() => {
    console.log('Selected Document form redux',selectedDocuments );
    console.log('Selected Document local',documents );

    setDocuments([...(selectedDocuments  || [])
    ]);
    setKnowledge([
      ...seletedCompanyKnowldge,
      ...seletedIndustryKnowldge,
      ...seletedPersonalKnowldge,
    ]);
    if ('chat_id' in selectedChat) {
      setChatName(selectedChat.chat_name);
    }
  }, [selectedChat, currentChatsArray, selectedDocuments]);

  const openOrCloseManageKnowledgeWindow = (toggle) => {
    setShowManageKnowledgeWindow(toggle);
    dispatch(setDocumentProcessingAlert({ show: false, message: '' }));
  };

  const removeDocument = async () => {

    try {
    const fileIds = [];
    const seletedContexts = [...seletedCompanyKnowldge,
      ...seletedIndustryKnowldge, ...seletedPersonalKnowldge];
    const seletedContextIds = [];
    seletedContexts.forEach((ele) => {
      seletedContextIds.push(ele.context_id);
    });
    if (selectedDocuments.length > 0) {
      selectedDocuments.forEach((ele) => {
        fileIds.push(ele.file_id);
      });
    }
    const data = {
      user_id: userId,
      chat_id: selectedChat.chat_id,
      files_selected: fileIds,
      contexts_selected: seletedContextIds,
      industry_selected: 'Payments',
    };
    console.log('data', data);

    const res = await fetch('https://lumosusersessionmgmt-dev.aexp.com/manageChatContext', { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } });
    if (res.ok) {
      const updatedChatsArray = getUpdatedChatsArray({
        previousChatsArray: currentChatsArray,
        chatId: selectedChat.chat_id,
        seletedContexts,
        selectedDocuments,
      });
      dispatch(setCurrentChat(updatedChatsArray));
      const result = await res.json();
      if (result.status === 'Success') { toast.success('Updated Successfully'); }
    } else {
      toast.error('Something went wrong: Invalid Inputs');
    }
  } catch (error) { toast.error('Something went wrong while opening chat components'); }

    
  }

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
        <div className={styles.section}>
          <strong>Documents</strong>
          <div className={styles.filesContainer}>
            {selectedDocuments.map((doc) => (
              <div key={doc.file_id} className={styles.documentWrapper}>
                <button type="button" className={styles.button}>{doc.additional_info.fileName ? doc.additional_info.fileName : doc.file_name}</button>
                {doc.file_name !== currentSessionDetails.session_name ? (<span
                  className={styles.removeButton}
                  title='Remove Document'
                  aria-label={`Remove ${doc.file_name}`}
                  onClick={removeDocument}
                >
                  x
                </span>) : null}
              </div>
            ))}
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
