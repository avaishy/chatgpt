useEffect(() => {
  if (userId) {
    const fetchAndSetSession = async () => {
      const sessions = await getPreviousSessions(); // should return the array
      dispatch(setRefressPreviousSession(false));

      if (!sessions || !selectChat?.chat_id) return;

      // Find the session that contains the chat with matching ID
      const matchedSession = sessions.find(session =>
        session.chats?.some(chat => chat.chat_id === selectChat.chat_id)
      );

      if (matchedSession) {
        dispatch(setCurrentSessionDetails(matchedSession));
      }
    };

    fetchAndSetSession();
  }
}, [userId, selectChat?.chat_id]);