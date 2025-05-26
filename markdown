
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
      if (res.status === 200) {
        toast.success('Indexing completed...');
      }
    } catch (err) {
      console.log('Error starting indexing');
    }
  };

  const fetchFileStatuses = async () => {
    try {
      const response = await fetch('https://lumosusersessionmgmt-dev.aexp.com/getFilesFeatureOpsStats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          use_case: useCase === 'earnings_call_transcript' ? 'Earnings Call Transcript' : useCase,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        return result;
      }
      toast.error('Invalid request. Please try again later');
      return [];
    } catch (error) {
      toast.error('Something went wrong while loading file statuses. Please try again later');
      return [];
    }
  };

  const createChatSession = async ({
    selectedDocuments: docs,
    userId: uid,
    useCase: uCase,
    seletedCompanyKnowldge: compKnow,
    seletedIndustryKnowldge: indKnow,
    seletedPersonalKnowldge: perKnow,
    industryType: industry,
  }) => {
    const fileIds = docs.map((doc) => doc.file_id);
    const selectedContexts = [
      ...compKnow,
      ...indKnow,
      ...perKnow,
    ];
    const contextIds = selectedContexts.map((ctx) => ctx.context_id);
    const useCaseTemp = uCase === 'earnings_call_transcript' ? 'Earnings Call Transcript' : uCase;

    const body = {
      user_id: uid,
      user_agent: 'Windows 10',
      project_type: 'LUMOS',
      use_case: useCaseTemp,
      files_selected: fileIds,
      contexts_selected: contextIds,
      industry_selected: industry,
    };

    try {
      const res = await fetch('https://lumosusersessionmgmt-dev.aexp.com/createChatSession', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        return res;
      }
      if (res.status === 422) {
        toast.error('Unprocessable Entity: Invalid input provided');
      } else if (res.status === 500) {
        toast.error('Server Error: Something went wrong');
      } else {
        toast.error('Please try again later');
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
      dispatch(toggleNewSession(false));
      const status = await getFileStatus(selectedDoc.file_name);

      if (!status.is_indexed) {
        await startFileIndexing(selectedDoc.file_id);
      }

      dispatch(setChatMessages([]));
      dispatch(setAllBotSourcesArray([]));
      dispatch(setCurrentSessionDetails({}));
      dispatch(setCurrentChat([]));
      dispatch(toggleEditContextButton(true));
      dispatch(setToggleCurrentSession(false));
      dispatch(toggleChatComponent(false));
      dispatch(setUserSelectedDocumentsForChat(selectedDocuments));

      const res = await createChatSession({
        selectedDocuments,
        userId,
        useCase,
        seletedCompanyKnowldge,
        seletedIndustryKnowldge,
        seletedPersonalKnowldge,
        industryType,
      });

      if (res.ok) {
        const result = await res.json();
        dispatch(setToggleProcessingStatus(false));
        dispatch(toggleChatComponent(true));
        dispatch(setCurrentSessionDetails(result));
        dispatch(setCurrentChat(result.chats));
        dispatch(setToggleCurrentSession(true));
        dispatch(toggleEditContextButton(false));
      }
    } else {
      try {
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
