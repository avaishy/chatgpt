/* istanbul ignore file */
import React, { useEffect, useState } from 'react';
import { Navigation } from '@americanexpress/dls-react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import NewSesssion from './NewSession';
import styles from '../../../styles/sessionsNav.scss';
import ChatComponentWrapper from '../chatScreen/ChatComponentWrapper';
import CurrentSessions from '../utility/CurrrentSessions';
import {
  getShowNewSession,
  getCurrentSessionDetails,
  getToggleChatComponent,
  getUserId,
} from '../../../store/selectors/earningsCallTranscriptSelectors';
import {
  toggleNewSession, setCurrentSessionDetails,
  setUserSelectedCompanyKnowledge,
  setUserSelectedIndustryKnowledge,
  setUserSelectedPersonalKnowledge,
  toggleChatComponent,
  setDocumentProcessingAlert,
  setUserSelectedDocumentsForChat,
  setCurrentChat,
  toggleEditContextButton,
  addUseCase,
} from '../../../store/actions/earningsCallTranscriptActions';
import FileProcessingStatus from '../utility/FileProcessingStatus';

const SessionsNav = () => {
  const dispatch = useDispatch();
  const showNewSession = useSelector((state) => getShowNewSession(state));
  // const useCase = useSelector((state) => getUseCase(state));
  const userId = useSelector((state) => getUserId(state));
  const showChatComponent = useSelector((state) => getToggleChatComponent(state));
  // const fileProcessButtonShow = useSelector((state) => getFileProcessingStatus(state));
  const [previousSessions, setPreviousSessions] = useState([]);
  const currentSessionDetails = useSelector((state) => getCurrentSessionDetails(state));
  const [fileProcessStatus, setFileProcessStatus] = useState(false);

  const handleNewSessionClick = () => {
    dispatch(setUserSelectedCompanyKnowledge([]));
    dispatch(setUserSelectedIndustryKnowledge([]));
    dispatch(setUserSelectedPersonalKnowledge([]));
    dispatch(setUserSelectedDocumentsForChat([]));
    dispatch(toggleNewSession(true));
    dispatch(toggleChatComponent(false));
    setFileProcessStatus(false);
  };

  const handleFileProcessingClick = () => {
    dispatch(toggleChatComponent(false));
    setFileProcessStatus(true);
    dispatch(toggleNewSession(false));
  };

  const getPreviousSessions = async () => {
    dispatch(addUseCase('earnings_call_transcript'));
    const sessionsArray = [];
    let localUseCase = null;
    try {
      localUseCase = 'Earnings Call Transcript';
      const data = {
        user_id: userId,
        project_type: 'LUMOS',
        user_agent: 'Windows 10',
        use_case: localUseCase,
        no_of_chats: 10,
      };
      const res = await fetch('https://lumosusersessionmgmt-dev.aexp.com/getUserSessionChats', { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } });
      if (res.ok) {
        const result = await res.json();
        result.forEach((ele) => {
          if (ele.session_name != null) {
            sessionsArray.push(ele);
          } else {
            sessionsArray.push('----');
          }
        });
        setPreviousSessions(sessionsArray);
      }
    } catch (error) { toast.error('Unable to load previous sessions'); }
  };

  useEffect(() => {
    getPreviousSessions();
  }, [showChatComponent, currentSessionDetails]);

  const navigateToPreviousSession = async (session) => {
    setFileProcessStatus(false);
    dispatch(setCurrentSessionDetails(session));
    dispatch(setCurrentChat(session.chats));
    dispatch(toggleNewSession(false));
    dispatch(toggleChatComponent(true));
    dispatch(toggleEditContextButton(false));
    dispatch(setDocumentProcessingAlert({ show: false, message: '' }));
  };

  return (
    <div>
      <div className={`${styles.newSessionPage}`}>
        <Navigation theme={{
          maxWidth: '320px',
          minWidth: '320px',
          height: '100%',
          backgroundColor: ' #364258',
          border: '0px',
        }}
        >
          <div className={`${styles.buttonContainer}`}>
            <button type="button" size="md" className={`${styles.newSessionButton}`} onClick={handleNewSessionClick}>New Session</button>
          </div>
          {showChatComponent === true ? <CurrentSessions /> : null}
          <div className={showChatComponent === true
            ? styles.previousSessionsContainerInsideChat
            : styles.previousSessionsContainer}
          >
            <p className={`${styles.text}`}>Previous Session</p>
            {previousSessions.map((session) => (
              <div key={session.session_id} className={`${styles.navigationContainer}`}>
                <button key={session.session_id} type="button" className={`${styles.navigationItem}`} onClick={() => navigateToPreviousSession(session)}><p className={styles.sessionNames}>{session.session_name}</p> {/* <MiniProcessingMessage /> */}</button>
              </div>
            ))}
          </div>
          <div className={`${styles.buttonContainer}`}>
            <button type="button" size="md" className={`${styles.newSessionButton}`} onClick={handleFileProcessingClick}>File Processing status</button>
          </div>
        </Navigation>
        {fileProcessStatus === true ? <FileProcessingStatus /> : null}
        {showNewSession === true ? <NewSesssion /> : null}
        {showChatComponent === true ? <ChatComponentWrapper /> : null}
      </div>
    </div>
  );
};

export default SessionsNav;
