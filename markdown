const getFileStatus = async (fileName) => {
  try {
    const res = await fetch(`https://lumosusersessionmgmt-dev.aexp.com/getFileStatus/${fileName}`, {
      method: 'GET',
      headers: { accept: 'application/json' },
    });
    return await res.json();
  } catch (err) {
    toast.error('Failed to check file status');
    return { is_indexed: false };
  }
};

const startFileIndexing = async (fileId) => {
  try {
    const res = await fetch(`https://lumosusersessionmgmt-dev.aexp.com/indexFile/${fileId}`, {
      method: 'POST',
      headers: { accept: 'application/json' },
    });
    if (res.ok) {
      toast.info('Indexing started...');
      return await res.json();
    } else {
      toast.error('Failed to start indexing');
      return null;
    }
  } catch (err) {
    toast.error('Error starting indexing');
    return null;
  }
};

const pollUntilIndexed = async (fileName, maxAttempts = 10, delay = 3000) => {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const status = await getFileStatus(fileName);
    if (status.is_indexed) return true;
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
  toast.error('Indexing timeout. Please try again later.');
  return false;
};

const createChatSession = async ({
  selectedDocuments,
  userId,
  useCase,
  seletedCompanyKnowldge,
  seletedIndustryKnowldge,
  seletedPersonalKnowldge,
  industryType,
  dispatch,
}) => {
  const fileIds = selectedDocuments.map((doc) => doc.file_id);
  const selectedContexts = [...seletedCompanyKnowldge, ...seletedIndustryKnowldge, ...seletedPersonalKnowldge];
  const contextIds = selectedContexts.map((ctx) => ctx.context_id);
  const useCaseTemp = useCase === 'earnings_call_transcript' ? 'Earnings Call Transcript' : useCase;

  const body = {
    user_id: userId,
    user_agent: 'Windows 10',
    project_type: 'LUMOS',
    use_case: useCaseTemp,
    files_selected: fileIds,
    contexts_selected: contextIds,
    industry_selected: industryType,
  };

  try {
    const res = await fetch('https://lumosusersessionmgmt-dev.aexp.com/createChatSession', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      const result = await res.json();
      dispatch(setCurrentSessionDetails(result));
      dispatch(setCurrentChat(result.chats));
      dispatch(toggleEditContextButton(false));
      dispatch(setDocumentProcessingAlert({ show: false, message: '' }));
      return true;
    } else {
      if (res.status === 422) {
        toast.error('Unprocessable Entity: Invalid input provided');
      } else if (res.status === 500) {
        toast.error('Server Error: Something went wrong');
      } else {
        toast.error('Please try again later');
      }
    }
  } catch (error) {
    toast.error('Network error while creating chat session');
  }
  return false;
};




const openChatComponent = async () => {
  if (!selectedDocuments?.length) {
    toast.error('No document selected');
    return;
  }

  const selectedDoc = selectedDocuments[0];

  if (!isUsedByManageContext) {
    dispatch(setToggleProcessingSession(true));

    const status = await getFileStatus(selectedDoc.file_name);

    if (!status.is_indexed) {
      await startFileIndexing(selectedDoc.file_id);
      const indexed = await pollUntilIndexed(selectedDoc.file_name);
      if (!indexed) {
        dispatch(setToggleProcessingSession(false));
        return;
      }
    }

    // Reset state
    dispatch(setChatMessages([]));
    dispatch(setAllBotSourcesArray([]));
    dispatch(setCurrentSessionDetails({}));
    dispatch(setCurrentChat([]));
    dispatch(toggleNewSession(false));
    dispatch(toggleEditContextButton(true));
    dispatch(toggleChatComponent(true));
    dispatch(setToggleCurrentSession(false));
    dispatch(setUserSelectedDocumentsForChat(selectedDocuments));

    const success = await createChatSession({
      selectedDocuments,
      userId,
      useCase,
      seletedCompanyKnowldge,
      seletedIndustryKnowldge,
      seletedPersonalKnowldge,
      industryType,
      dispatch,
    });

    if (!success) {
      dispatch(toggleChatComponent(false));
    }

    dispatch(setToggleProcessingSession(false));
  } else {
    // ManageContext mode (unchanged)
    try {
      const fileIds = selectedDocuments.map((d) => d.file_id);
      const selectedContexts = [...seletedCompanyKnowldge, ...seletedIndustryKnowldge, ...seletedPersonalKnowldge];
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
};