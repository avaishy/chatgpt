
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
      if (matchedSession && !refreshCurrentSession) {
         console.log('matchedSession1', matchedSession);
     console.log('refreshCurrentSession1', refreshCurrentSession);
     console.log('shouldPreviousSessionRefresh', shouldPreviousSessionRefresh);
        dispatch(setCurrentSessionDetails(matchedSession));
        dispatch(setCurrentChat(matchedSession.chats));
        dispatch(setRefressCurrentSession(true));
     }
    };
 
      fetchAndSetSession();
    
      dispatch(setRefressPreviousSession(false));
    }
  }, [getPreviousSessions, shouldPreviousSessionRefresh]);
  useEffect(() => {
    fetchProcessingFilesAndChats();
  }, [shouldProcessingSessionRefresh]);
  currentSessionDetails {session_id: '4a83aa00-c58f-45c5-b783-944ad605f782', session_name: 'Barclays.pdf', crt_ts: '2025-06-03 05:50:13.821318', status: 'Completed', job_stage: 'chats_creation', …}
CurrrentSessions.jsx:80 getCurrentChatDetails [{…}]
CurrrentSessions.jsx:81 selected chat details {chat_id: '4386cad0-bf2e-47c4-9234-c0a286940892', chat_name: 'Q2 : Identify risks discussed by management', crt_ts: '2025-06-03T05:55:17.544227', files_selected: Array(1), contexts_selected: Array(0)}
SessionsNav.jsx:202 previousSessions (3) [{…}, {…}, {…}]
SessionsNav.jsx:211 matchedSession {session_id: '4a83aa00-c58f-45c5-b783-944ad605f782', session_name: 'Barclays.pdf', crt_ts: '2025-06-03 05:50:13.821318', status: 'Completed', job_stage: 'chats_creation', …}
SessionsNav.jsx:212 refreshCurrentSession {type: 'module/research-assistant-root/SET_SHOULD_CURRENT_SESSION', payload: Map}
CurrrentSessions.jsx:77 currentSessionDetails {session_id: '4a83aa00-c58f-45c5-b783-944ad605f782', session_name: 'Barclays.pdf', crt_ts: '2025-06-03 05:50:13.821318', status: 'Completed', job_stage: 'chats_creation', …}
CurrrentSessions.jsx:80 getCurrentChatDetails [{…}]
CurrrentSessions.jsx:81 selected chat details {chat_id: '4386cad0-bf2e-47c4-9234-c0a286940892', chat_name: 'Q2 : Identify risks discussed by management', crt_ts: '2025-06-03T05:55:17.544227', files_selected: Array(1), contexts_selected: Array(0)}
SessionsNav.jsx:202 previousSessions (3) [{…}, {…}, {…}]
SessionsNav.jsx:211 matchedSession {session_id: '4a83aa00-c58f-45c5-b783-944ad605f782', session_name: 'Barclays.pdf', crt_ts: '2025-06-03 05:50:13.821318', status: 'Completed', job_stage: 'chats_creation', …}
SessionsNav.jsx:212 refreshCurrentSession {type: 'module/research-assistant-root/SET_SHOULD_CURRENT_SESSION', payload: Map}
