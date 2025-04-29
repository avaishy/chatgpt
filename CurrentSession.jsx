/* istanbul ignore file */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import styles from '../../../styles/currentSessions.scss';
import {
  getCurrentSessionDetails,
  getCurrentChatDetails,
  getSelectedChatDetails,
  getUserSelectedDocumentForChat,
} from '../../../store/selectors/earningsCallTranscriptSelectors';
import {
  setUserSelectedDocumentsForChat,
  setUserSelectedCompanyKnowledge,
  setUserSelectedIndustryKnowledge,
  setUserSelectedPersonalKnowledge,
  setSelectedChat,
  setChatMessages,
} from '../../../store/actions/earningsCallTranscriptActions';
import MiniProcessingMessage from './MiniProcessingMessage';

function CurrentSessions() {
  const [isLoadedChatId, setIsLoadedChatId] = useState('');
  const dispatch = useDispatch();
  const userSelectDocuments = useSelector((state) => getUserSelectedDocumentForChat(state));
  const currentSessionDetails = useSelector((state) => getCurrentSessionDetails(state));
  const allChats = useSelector((state) => getCurrentChatDetails(state));
  const selectedChat = useSelector((state) => getSelectedChatDetails(state));
  // const [selectedChatButton, setSelectedChatButton] = useState('');

  const selectChat = async (chats) => {
    let chatMessages = [];
    setIsLoadedChatId(chats.chat_id);
    try {
      const res = await fetch(`https://lumosusersessionmgmt-dev.aexp.com/getUserChatHistory/${chats.chat_id}`, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
      if (res.ok) {
        chatMessages = await res.json();
        const knowledge = chats.contexts_selected;
        const companyContext = [];
        const personalContext = [];
        const industryContext = [];

        knowledge.forEach((element) => {
          if (element.context_type === 'company knowledge') {
            companyContext.push(element);
          }
          if (element.context_type === 'industry knowledge') {
            industryContext.push(element);
          }
          if (element.context_type === 'personal knowledge') {
            personalContext.push(element);
          }
        });
        dispatch(setUserSelectedDocumentsForChat(chats.files_selected));
        dispatch(setUserSelectedCompanyKnowledge(companyContext));
        dispatch(setUserSelectedIndustryKnowledge(industryContext));
        dispatch(setUserSelectedPersonalKnowledge(personalContext));
        dispatch(setChatMessages(chatMessages));
        dispatch(setSelectedChat(chats));
        // setSelectedChatButton(chats.chat_name);
        toast.success('Successfully Navigated');
      }
    } catch (error) { toast.error(`failed to fetch previous chats ${error}`); } finally {
      setIsLoadedChatId('');
    }
  };
  useEffect(() => {
    if ('chats' in currentSessionDetails && currentSessionDetails.chats.length > 0) {
      selectChat(currentSessionDetails.chats[0]);
    }
  }, [currentSessionDetails]);

  return (
    <div>
      <div className={`${styles.currentSessionContainer}`}>
        <p className={`${styles.header}`}>Current Session</p>
        <div className={`${styles.buttonContainerWrapper}`}>
          <div className={styles.sessionContainer}>
            <button type="button" className={`${styles.currentSessionButton}`}>
              <p className={`${styles.text}`}>{currentSessionDetails.session_name
                || (userSelectDocuments?.[0]?.file_name?.split('/')?.pop() ?? 'Untitled Session')}
              </p>
            </button>
          </div>
          {allChats.length > 0 ? allChats.map((ele) => (
            <div key={ele.chat_id} className={styles.buttonContainer}>
              <h3>{selectedChat.chat_id === ele.chat_id}</h3>
              <button
                type="button"
                className={`
                ${styles.currentSessionButton}
                ${selectedChat?.chat_id === ele.chat_id ? styles.activeButton : ''}
                `}
                onClick={() => selectChat(ele)}
              >
                <div className={styles.textWrapper}>
                  <div className={styles.text}>{ele.chat_name}</div>
                  <div className={styles.tooltip}>{ele.chat_name}</div>
                </div>
                { isLoadedChatId === ele.chat_id
                  ? <MiniProcessingMessage /> : null}
              </button>
            </div>
          )) : null}
        </div>
      </div>
    </div>
  );
}

export default CurrentSessions;
