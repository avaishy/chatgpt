useEffect(() => {
  if (!userId || !selectedChat?.chat_id) return;

  const fetchAndSetSession = async () => {
    const sessions = await getPreviousSessions(); // ensure this returns session array
    dispatch(setRefressPreviousSession(false));

    const matchedSession = sessions.find(session =>
      session.chats?.some(chat => chat.chat_id === selectedChat.chat_id)
    );

    if (matchedSession && !refreshCurrentSession) {
      dispatch(setCurrentSessionDetails(matchedSession));
      dispatch(setCurrentChat(matchedSession.chats));
      dispatch(setRefressCurrentSession(true));
    }
  };

  fetchAndSetSession();
}, [userId, selectedChat?.chat_id, refreshCurrentSession]);