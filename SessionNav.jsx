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
  getToggleCurrentSession,
  getToggleProcessingStatus,
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
  setToggleCurrentSession,
  setToggleProcessingStatus,
} from '../../../store/actions/earningsCallTranscriptActions';
import ProcessingStatus from '../utility/ProcessingStatus';

const SessionsNav = () => {
  const dispatch = useDispatch();
  const showNewSession = useSelector((state) => getShowNewSession(state));
  const userId = useSelector((state) => getUserId(state));
  const showChatComponent = useSelector((state) => getToggleChatComponent(state));
  const [previousSessions, setPreviousSessions] = useState([]);
  const currentSessionDetails = useSelector((state) => getCurrentSessionDetails(state));
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [isSessionsId, setIsSessionsId] = useState(true);
  const showCurrentSession = useSelector((state) => getToggleCurrentSession(state));
  const showProcessStatus = useSelector((state) => getToggleProcessingStatus(state));

  const handleNewSessionClick = () => {
    dispatch(setUserSelectedCompanyKnowledge([]));
    dispatch(setUserSelectedIndustryKnowledge([]));
    dispatch(setUserSelectedPersonalKnowledge([]));
    dispatch(setUserSelectedDocumentsForChat([]));
    dispatch(toggleNewSession(true));
    dispatch(toggleChatComponent(false));
    dispatch(setToggleProcessingStatus(false));
  };

  const handleFileProcessingClick = () => {
    dispatch(toggleChatComponent(false));
    dispatch(toggleNewSession(false));
    dispatch(setToggleProcessingStatus(true));
  };

  const getPreviousSessions = async () => {
    setLoadingSessions(true);
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
    } catch (error) {
      toast.error('Unable to load previous sessions');
    } finally {
      setLoadingSessions(false);
    }
  };

  useEffect(() => {
    getPreviousSessions();
  }, [showChatComponent, currentSessionDetails]);

  const navigateToPreviousSession = async (session) => {
    dispatch(setToggleCurrentSession(true));
    setIsSessionsId(session.session_id);
    dispatch(setToggleProcessingStatus(false));
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
          <div />
          {showChatComponent && showCurrentSession && <CurrentSessions />}
          <div className={showChatComponent === true
            ? styles.previousSessionsContainerInsideChat
            : styles.previousSessionsContainer}
          >
            <p className={`${styles.text}`}>Previous Session</p>
            {loadingSessions
              ? (
                <> <div className={styles.skeletonSession} />
                  <div className={styles.skeletonSession} />
                  <div className={styles.skeletonSession} />
                  <div className={styles.skeletonSession} />
                  <div className={styles.skeletonSession} />
                </>

              )
              : previousSessions.map((session) => (
                <div key={session.session_id} className={`${styles.navigationContainer}`}>
                  <button
                    key={session.session_id}
                    type="button"
                    className={`${styles.navigationItem} ${isSessionsId === session.session_id ? styles.activeButton : ''}`}
                    onClick={() => navigateToPreviousSession(session)}
                  >
                    <div className={styles.textWrapper}>
                      <p className={styles.sessionNames}>{session.session_name}</p>
                      <div className={styles.tooltip}>{session.session_name}</div>
                    </div>
                  </button>
                </div>
              ))}
          </div>
          <div className={`${styles.buttonContainer}`}>
            <button type="button" size="md" className={`${styles.newSessionButton}`} onClick={handleFileProcessingClick}>Processing status</button>
          </div>
        </Navigation>
        {showProcessStatus === true ? <ProcessingStatus /> : null}
        {showNewSession === true ? <NewSesssion /> : null}
        {showChatComponent === true ? <ChatComponentWrapper /> : null}
      </div>
    </div>
  );
};

export default SessionsNav;
