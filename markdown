
  useEffect(() => {
    if (userId) {
      getPreviousSessions(); 
      const fetchAndSetSession = async () => {
      
      console.log('previousSessions',previousSessions);
      dispatch(setRefressPreviousSession(false));

      if (!previousSessions || !selectedChat?.chat_id) return;

      // Find the session that contains the chat with matching ID
      const matchedSession = previousSessions.find(session =>
        session.chats?.some(chat => chat.chat_id === selectedChat.chat_id)
      );
     console.log('matchedSession', matchedSession);
      const matchedChats = matchedSession.find(chat =>
        chat.chat_id?.some(chat => chat.chat_id === selectedChat.chat_id)
      );
      if (matchedChats) {
        dispatch(setCurrentSessionDetails(matchedChats));
      }
    };

    fetchAndSetSession();
    }
  }, [getPreviousSessions]);

  previousSessions (3) [{…}, {…}, {…}]0: {session_id: '4a83aa00-c58f-45c5-b783-944ad605f782', session_name: 'Barclays.pdf', crt_ts: '2025-06-03 05:50:13.821318', chats: Array(6)}1: {session_id: 'd9d4c1dd-3d85-47d1-ab8d-11e6f148f5dc', session_name: 'Mastercard Inc Q4 2023 Earnings Call Transcript.pdf', crt_ts: '2025-06-03 05:16:43.330085', chats: Array(6)}2: {session_id: '9275eaef-a2e4-44c3-afa2-2a4f3c20b2b5', session_name: 'Mastercard Inc Q4 2023 Earnings Call Transcript.pdf', crt_ts: '2025-06-03 04:09:52.442746', chats: Array(6)}length: 3[[Prototype]]: Array(0)
SessionsNav.jsx:207 matchedSession 
