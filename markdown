
if (notIndexedFiles.length > 0) {
  // Update chat status in Redux/UI to 'Processing'
  const updatedChatsArray = currentChatsArray.map(chat => {
    if (chat.chat_id === selectedChat.chat_id) {
      return { ...chat, status: 'Processing' };
    }
    return chat;
  });
  dispatch(setCurrentChat(updatedChatsArray));
}