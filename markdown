previousSessions (3) [{…}, {…}, {…}]
SessionsNav.jsx:211 matchedSession {session_id: '4a83aa00-c58f-45c5-b783-944ad605f782', session_name: 'Barclays.pdf', crt_ts: '2025-06-03 05:50:13.821318', status: 'Completed', job_stage: 'chats_creation', …}
SessionsNav.jsx:212 refreshCurrentSession false
ManageContext.jsx:67  knowledge 452 refreshCurrentSession false
SessionsNav.jsx:202 previousSessions (3) [{…}, {…}, {…}]
SessionsNav.jsx:211 matchedSession {session_id: '4a83aa00-c58f-45c5-b783-944ad605f782', session_name: 'Barclays.pdf', crt_ts: '2025-06-03 05:50:13.821318', status: 'Completed', job_stage: 'chats_creation', …}
SessionsNav.jsx:212 refreshCurrentSession true
SessionsNav.jsx:214 matchedSession {session_id: '4a83aa00-c58f-45c5-b783-944ad605f782', session_name: 'Barclays.pdf', crt_ts: '2025-06-03 05:50:13.821318', status: 'Completed', job_stage: 'chats_creation', …}
SessionsNav.jsx:215 refreshCurrentSession true
SessionsNav.jsx:202 previousSessions (3) [{…}, {…}, {…}]
SessionsNav.jsx:211 matchedSession {session_id: '4a83aa00-c58f-45c5-b783-944ad605f782', session_name: 'Barclays.pdf', crt_ts: '2025-06-03 05:50:13.821318', status: 'Completed', job_stage: 'chats_creation', …}
SessionsNav.jsx:212 refreshCurrentSession false
ManageContext.jsx:67  knowledge 452 refreshCurrentSession false
SessionsNav.jsx:202 previousSessions (3) [{…}, {…}, {…}]
SessionsNav.jsx:211 matchedSession {session_id: '4a83aa00-c58f-45c5-b783-944ad605f782', session_name: 'Barclays.pdf', crt_ts: '2025-06-03 05:50:13.821318', status: 'Completed', job_stage: 'chats_creation', …}
SessionsNav.jsx:212 refreshCurrentSession true
SessionsNav.jsx:214 matchedSession {session_id: '4a83aa00-c58f-45c5-b783-944ad605f782', session_name: 'Barclays.pdf', crt_ts: '2025-06-03 05:50:13.821318', status: 'Completed', job_stage: 'chats_creation', …}
SessionsNav.jsx:215 refreshCurrentSession true
SessionsNav.jsx:202 previousSessions (3) [{…}, {…}, {…}]
SessionsNav.jsx:211 matchedSession {session_id: '4a83aa00-c58f-45c5-b783-944ad605f782', session_name: 'Barclays.pdf', crt_ts: '2025-06-03 05:50:13.821318', status: 'Completed', job_stage: 'chats_creation', …}
SessionsNav.jsx:212 refreshCurrentSession false
ManageContext.jsx:67  knowledge 452 refreshCurrentSession false
SessionsNav.jsx:202 previousSessions (3) [{…}, {…}, {…}]
SessionsNav.jsx:211 matchedSession {session_id: '4a83aa00-c58f-45c5-b783-944ad605f782', session_name: 'Barclays.pdf', crt_ts: '2025-06-03 05:50:13.821318', status: 'Completed', job_stage: 'chats_creation', …}
SessionsNav.jsx:212 refreshCurrentSession true
SessionsNav.jsx:214 matchedSession {session_id: '4a83aa00-c58f-45c5-b783-944ad605f782', session_name: 'Barclays.pdf', crt_ts: '2025-06-03 05:50:13.821318', status: 'Completed', job_stage: 'chats_creation', …}
SessionsNav.jsx:215 refreshCurrentSession true
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
  getShouldRefreshCurrentSession,
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
  const showBanner = useSelector((state) => getToggleProcessingBanner(state));
  const isEditContextEnable = useSelector((state) => getEditContextButton(state));
  const dispatch = useDispatch();
  const refreshCurrentSession = useSelector((state) => getShouldRefreshCurrentSession(state));

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
      const data = {
        user_id: userId,
        chat_id: selectedChat.chat_id,
        files_selected: updatedFileIds,
        contexts_selected: seletedContextIds,
        industry_selected: 'Payments',
      };
      const res = await fetch('https://lumosusersessionmgmt-dev.aexp.com/manageChatContext', { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } });
      if (res.status === 200) {
        dispatch(setRefressPreviousSession(true));
        dispatch(setRefressCurrentSession(true));
        console.log(' knowledge 452 refreshCurrentSession', refreshCurrentSession);
      } else {
        toast.error('Something went wrong');
      }
    } catch (error) {
      toast.error('Something went wrong while opening chat components');
    }
  };

  useEffect(() => {
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
 in knowledge 
        const fileStatuses = await fetchFileStatuses();
        const notIndexedFiles = selectedDocuments.filter((doc) => {
          const statusEntry = fileStatuses.find((indexFile) => indexFile.file_id === doc.file_id);
          return statusEntry && statusEntry.status !== 'Completed';
        });
        if (notIndexedFiles.length > 0) {
          const filesName = notIndexedFiles.map((doc) => doc.file_name).join(', ');
          dispatch(setTogglePopup(true, `Indexing of these files: ${filesName} started. Once indexing is complete it will automatically added to the Manage Context.`));
          openOrCloseManageKnowledgeWindow(false);
        }

        await Promise.all(
          notIndexedFiles.map((file) => startFileIndexing(file.file_id))
        );

        const fileIds = selectedDocuments.map((d) => d.file_id);
        const selectedContexts = [
          ...seletedCompanyKnowldge,
          ...seletedIndustryKnowldge,
          ...seletedPersonalKnowldge,
        ];
        const contextIds = selectedContexts.map((ctx) => ctx.context_id);

        const body = {
          user_id: userId,
          chat_id: selectedChat.chat_id,
          files_selected: fileIds,
          contexts_selected: contextIds,
          industry_selected: industryType,
        };

        const allSelectedDocs = [
          ...userSelectedDocumentsFromReduxStore,
          ...selectedDocuments.filter(
            (doc) => !userSelectedDocumentsFromReduxStore.some((d) => d.file_id === doc.file_id)
          ),
        ];

        dispatch(setUserSelectedDocumentsForChat(allSelectedDocs));
        openOrCloseManageKnowledgeWindow(false);
        const res = await fetch('https://lumosusersessionmgmt-dev.aexp.com/manageChatContext', {
          method: 'POST',
          body: JSON.stringify(body),
          headers: { 'Content-Type': 'application/json' },
        });

        if (res.ok) {
          const result = await res.json();
          if (result.status === 'Success') {
            const updatedChatsArray = getUpdatedChatsArray({
              previousChatsArray: currentChatsArray,
              chatId: selectedChat.chat_id,
              seletedContexts: selectedContexts,
              selectedDocuments,
            });
            dispatch(setRefressCurrentSession(true));
            console.log(' knowledge 452 refreshCurrentSession', refreshCurrentSession);

            dispatch(setRefressPreviousSession(true));
            dispatch(setToggleProcessingStatus(false));
            dispatch(setCurrentChat(updatedChatsArray));
            toast.success('Updated Successfully');
          }
        } else {
          toast.error('Something went wrong: Invalid Inputs');
        }
      } catch (error) {
        toast.error('Something went wrong while opening chat components');
      }
    }

  const getPreviousSessions = useCallback(async () => {
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
  }, [shouldPreviousSessionRefresh]);

  const navigateToPreviousSession = async (session) => {
    dispatch(setRefressProcessingSession(true));
    dispatch(setCurrentProcessingButton(false));
    dispatch(setToggleBanner(false));
    dispatch(setToggleCurrentSession(true));
    setIsSessionsId(session.session_id);
    dispatch(setToggleProcessingStatus(false));
    dispatch(setCurrentSessionDetails(session));
    dispatch(setCurrentChat(session.chats));
    dispatch(toggleNewSession(false));
    dispatch(toggleChatComponent(true));
    dispatch(toggleEditContextButton(false));
  };

  if (showChatComponent === true && showBanner === false) {
    containerClass = styles.previousSessionsContainerInsideChat;
  } else if (showProcessingButton === true) {
    containerClass = styles.previousCurrentContainer;
  } else {
    containerClass = styles.previousSessionsContainer;
  }
  

  useEffect(() => {
    if (userId) {
      getPreviousSessions(); 
      const fetchAndSetSession = async () => {
      
      console.log('previousSessions',previousSessions);
      

      if (!previousSessions || !selectedChat?.chat_id) return;

      // Find the session that contains the chat with matching ID
      const matchedSession = previousSessions.find(session =>
        session.chats?.some(chat => chat.chat_id === selectedChat.chat_id)
      );
       console.log('matchedSession', matchedSession);
     console.log('refreshCurrentSession', refreshCurrentSession);
      if (matchedSession && refreshCurrentSession) {
        console.log('matchedSession', matchedSession);
     console.log('refreshCurrentSession', refreshCurrentSession);
        dispatch(setCurrentSessionDetails(matchedSession));
        dispatch(setCurrentChat(matchedSession.chats));
        dispatch(setRefressCurrentSession(false));
     }
    };
 
      fetchAndSetSession();
    
      dispatch(setRefressPreviousSession(false));
    }
  }, [getPreviousSessions, shouldPreviousSessionRefresh,refreshCurrentSession]);
  useEffect(() => {
    fetchProcessingFilesAndChats();
  }, [shouldProcessingSessionRefresh]);
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
  }, [currentSessionDetails, refreshCurrentSession]);
