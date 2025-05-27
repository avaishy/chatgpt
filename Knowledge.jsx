/* istanbul ignore file */
import React, { useEffect, useState,useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from '@americanexpress/one-app-router';
import { toast } from 'react-hot-toast';
import PropTypes from 'prop-types';
import styles from '../../../styles/newSession.scss';
import AdditionalKnowledgeCard from './AdditionalKnowledgeCard';
import {
  setUserSelectedDocumentsForChat,
  toggleNewSession,
  setAllCompanyKnowledge,
  setAllIndustryKnowledge,
  setAllPersonalKnowledge,
  setCurrentSessionDetails,
  toggleChatComponent,
  setChatMessages,
  setAllBotSourcesArray,
  setCurrentChat,
  setAllUserFiles,
  setFileProcessingStatus,
  toggleEditContextButton,
  setTogglePopup,
  setToggleFileUpload,
  setToggleCurrentSession,
  setToggleProcessingStatus,
  setRefressPreviousSession,
} from '../../../store/actions/earningsCallTranscriptActions';
import {
  getUseCase, getUserSelectedDocumentForChat,
  getUserSelectedCompanyKnowledge,
  getUserSelectedPersonalKnowledge,
  getUserSelectedIndustryKnowledge,
  getSelectedChatDetails,
  getCurrentChatDetails,
  getUserId,
  getTogglePopup,
  getToggleFileUpload,
} from '../../../store/selectors/earningsCallTranscriptSelectors';
import FileUpload from './FileUpload';
import PopupMessage from '../utility/PopUpMessage';

function Knowledge({ isUsedByManageContext = false, openOrCloseManageKnowledgeWindow }) {
  const [companyKnowledge, setCompanyKnowledge] = useState([]);
  const [industryKnowledge, setIndustryKnowledge] = useState([]);
  const [personalKnowledge, setPersonalKnowledge] = useState([]);
  const [industryType, setIndustryType] = useState('Payments');
  const useCase = useSelector((state) => getUseCase(state));
  const {
    show: isPopupOpen,
    message: popupMessage,
  } = useSelector((state) => getTogglePopup(state));
  const userId = useSelector((state) => getUserId(state));
  const seletedCompanyKnowldge = useSelector((state) => getUserSelectedCompanyKnowledge(state));
  const seletedIndustryKnowldge = useSelector((state) => getUserSelectedIndustryKnowledge(state));
  const seletedPersonalKnowldge = useSelector((state) => getUserSelectedPersonalKnowledge(state));
  const dispatch = useDispatch();
  const [allUserDocuments, setAllUserDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [renderComponent, setRenderComponent] = useState(false);
  const userSelectedDocumentsFromReduxStore = useSelector(
    (state) => getUserSelectedDocumentForChat(state));
  const selectedChat = useSelector((state) => getSelectedChatDetails(state));
  const currentChatsArray = useSelector((state) => getCurrentChatDetails(state));
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(true);
  const isToggleFileUpload = useSelector((state) => getToggleFileUpload(state));
  const [isUploading, setIsUploading] = useState(false);

  function addSelectedDocuments(document) {
    if (isUsedByManageContext === false) {
      setSelectedDocuments([document]);
    } else {
      const exists = selectedDocuments.some((doc) => doc.file_id === document.file_id);
      if (!exists) {
        setSelectedDocuments((prev) => [...prev, document]);
      } else {
        setSelectedDocuments((prev) => prev.filter((doc) => doc.file_id !== document.file_id));
      }
    }
  }
  function toggleFileUploadComponent(condition) {
    dispatch(setToggleFileUpload(condition));
  }

  const handleFileUpload = async (data) => {
    setIsUploading(true);
    if (data.fileInput.length === 0) return;
    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('use_case', 'Earnings Call Transcript');
    formData.append('company_name', data.companyName || '');
    formData.append('date', data.date || '');
    formData.append('file_name', data.fileName || '');

    data.fileInput.forEach((file) => {
      formData.append('file', file);
    });
    try {
      const response = await fetch('https://lumosusersessionmgmt-dev.aexp.com/uploadFiles', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        dispatch(setToggleFileUpload(false));
        dispatch(setFileProcessingStatus(true));
        if (renderComponent === true) {
          setRenderComponent(false);
        } else {
          setRenderComponent(true);
        }
        setIsUploading(false);
        toast.success('Successfully uploaded file');
      } else {
        setIsUploading(false);
        dispatch(setTogglePopup(true, 'Failed to upload file: server error'));
      }
    } catch (error) {
      setIsUploading(false);
      dispatch(setTogglePopup(true, 'Failed to upload file: network error'));
    }
  };

  const getAllUserDocuments = useCallback(async () => {
    let useCaseTemp = null;
    setIsLoadingDocuments(true);
    try {
      if (useCase === 'earnings_call_transcript') {
        useCaseTemp = 'Earnings Call Transcript';
      }
      const data = {
        user_id: userId,
        use_case: useCaseTemp,
      };
      const res = await fetch('https://lumosusersessionmgmt-dev.aexp.com/getUserFiles', { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } });
      const result = await res.json();
      setAllUserDocuments(result);
      dispatch(setAllUserFiles(result));
      setFilteredDocuments(result);
    } catch (error) {
      console.log(error);
      toast.error('Please try again');
    } finally {
      setIsLoadingDocuments(false);
    }
  },[renderComponent]);

  const getUserAdditionalKnowledge = useCallback(async () => {
    let useCaseTemp = null;
    const lCompanyKnowledge = [];
    const lIndustryKnowledge = [];
    const lPersonalKnowledge = [];

    try {
      if (useCase === 'earnings_call_transcript') {
        useCaseTemp = 'Earnings Call Transcript';
      }
      const data = {
        user_id: userId,
        use_case: useCaseTemp,
      };
      const res = await fetch('https://lumosusersessionmgmt-dev.aexp.com/getUserContexts', { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } });
      const result = await res.json();
      result.forEach((element) => {
        if (element.context_type === 'company knowledge') {
          lCompanyKnowledge.push(element);
        }
        if (element.context_type === 'industry knowledge') {
          lIndustryKnowledge.push(element);
        }
        if (element.context_type === 'personal knowledge') {
          lPersonalKnowledge.push(element);
        }
      });
      setCompanyKnowledge(lCompanyKnowledge);
      setIndustryKnowledge(lIndustryKnowledge);
      setPersonalKnowledge(lPersonalKnowledge);
      dispatch(setAllCompanyKnowledge(lCompanyKnowledge));
      dispatch(setAllIndustryKnowledge(lIndustryKnowledge));
      dispatch(setAllPersonalKnowledge(lPersonalKnowledge));
    } catch (error) { toast.error('failed to fetch user knowledge'); }
  },[renderComponent]);

  const closeNewSession = () => {
    if (isUsedByManageContext === false) {
      dispatch(toggleNewSession(false));
    } else {
      openOrCloseManageKnowledgeWindow(false);
    }
  };

  const getUpdatedChatsArray = (dataObject) => {
    const newRference = [];
    dataObject.previousChatsArray.forEach((item) => {
      if (item.chat_id === dataObject.chatId) {
        newRference.push({
          ...item,
          files_selected: dataObject.selectedDocuments,
          contexts_selected: dataObject.seletedContexts,
        });
      } else {
        newRference.push(item);
      }
    });
    return newRference;
  };

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
        console.log('Indexing completed...');
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
        dispatch(setRefressPreviousSession(true));
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
  };

  const handleDocumentSearch = (event) => {
    const query = event.target.value;
    setFilteredDocuments(allUserDocuments.filter(
      (item) => item.file_name.toLowerCase().includes(query)));
  };

  const changeIndustryType = (event) => {
    setIndustryType(event.target.value);
  };

  useEffect(() => {
    getAllUserDocuments();
    getUserAdditionalKnowledge();
    if (isUsedByManageContext === true) {
      setSelectedDocuments(userSelectedDocumentsFromReduxStore);
    }
  }, [getAllUserDocuments,getUserAdditionalKnowledge]);

  return (
    <div className={isUsedByManageContext === false ? `${styles.container}` : `${styles.currentSessionContainer}`}>
      <div className={`${styles.header}`}>
        <h2>{isUsedByManageContext === false ? 'New Session' : 'Edit Session'}</h2>
        <button type="button" className={`${styles.closeButton}`} onClick={closeNewSession}>close</button>
      </div>
      <div className={`${styles.contentWrapper}`}>
        {/* Left: Documents */}
        <div className={`${styles.section}`}>
          <h3 className={`${styles.SectionTitle}`}>Add documents</h3>
          <div>
            <input type="text" placeholder="Search document" className={`${styles.input}`} onChange={handleDocumentSearch} />
          </div>
          <div className={isUsedByManageContext === false ? `${styles.documentList}` : `${styles.currentSessionDocumentList}`}>
            {isLoadingDocuments
              ? (
                <div className={styles.documentItem}>
                  <div className={styles.skeletonText} />
                  <div className={styles.skeletonText} />
                  <div className={styles.skeletonText} />
                  <div className={styles.skeletonText} />
                  <div className={styles.skeletonText} />
                  <div className={styles.skeletonText} />
                </div>
              )
              : filteredDocuments.map((doc, index) => (

                <div key={doc.file_id} className={`${styles.documentItem}`}>
                  {isUsedByManageContext === true ? (
                    <input
                      type="checkbox"
                      id={`doc-${index}`}
                      onChange={() => addSelectedDocuments(doc)}
                      checked={
                        selectedDocuments.some(
                          (selectedDoc) => selectedDoc.file_id === doc.file_id
                        )
}
                      disabled={
                      isUsedByManageContext
                      && userSelectedDocumentsFromReduxStore.some((d) => d.file_id === doc.file_id)
                    }
                    />
                  )
                    : (
                      <input
                        type="radio"
                        name="documentSelection"
                        id={`doc-${index}`}
                        onChange={() => addSelectedDocuments(doc)}
                      />
                    )}
                  <label
                    htmlFor={`doc-${index}`}
                    className={styles.singleFileContainer}
                    title={doc.additional_info
                      ? `${doc.additional_info.company_name}, ${doc.additional_info.date}`
                      : null}
                  >
                    {doc.additional_info.fileName ? doc.additional_info.fileName : doc.file_name}
                  </label>
                </div>
              ))}
          </div>
          <div className={isUsedByManageContext === false
            ? `${styles.fileUploadContainer}`
            : `${styles.currentSessionFileUploadContainer}`}
          >
            <button
              type="button"
              aria-label="Open File Upload"
              onClick={() => toggleFileUploadComponent(true)}
            >
              <svg viewBox="0 0 24 24" fill="black" width="24px" height="24px">
                <path d="M5 20h14v-2H5v2zm7-16l-5.5 5.5 1.41 1.41L11 8.83V17h2V8.83l3.09 3.09 1.41-1.41L12 4z" />
              </svg>
            </button>
            {isToggleFileUpload === true
              ? (
                <div className={styles.overlay}>
                  <div className={styles.popup}>
                    <FileUpload
                      handleFileUpload={handleFileUpload}
                    />
                  </div>
                </div>
              ) : null}
          </div>
        </div>

        {/* Right: Filters */}
        <div className={`${styles.section}`}>
          <div className={styles.additionalKnowledgeHeader}>
            <h3 className={`${styles.SectionTitle}`}>Add additional knowledge</h3>
            <Link to="/earnings-call-tanscripts/edit-knowledge" className={styles.overrideLink}>
              <button type="button" className={`${styles.editKnowledgeButton}`}>
                Edit Knowledge
              </button>
            </Link>

          </div>
          <AdditionalKnowledgeCard knowledgeType="company knowledge" knowledgeArray={companyKnowledge} />
          <AdditionalKnowledgeCard knowledgeType="industry knowledge" knowledgeArray={industryKnowledge} />
          <AdditionalKnowledgeCard knowledgeType="personal knowledge" knowledgeArray={personalKnowledge} />
        </div>
      </div>
      <div className={`${styles.footerSection}`}>
        <div>
          <label htmlFor="industry-select" className={styles.dropdownTitle}>Select Industry</label>
          <select value={industryType} onChange={changeIndustryType} className={styles.dropdown}>
            <option value="Payments">Payments</option>
            <option value="Airlines">Airlines</option>
          </select>
        </div>
        <button
          type="button"
          className={`${styles.answerButton}`}
          onClick={openChatComponent}
        >
          {isUsedByManageContext === false ? 'Generate Answers' : 'Submit'}
        </button>
      </div>
      {isPopupOpen && (
      <PopupMessage message={popupMessage} />
      )}
      {isUploading && (
      <div className={styles.uploadOverlay}>
        <div className={styles.spinner} />
        <div style={{ color: 'white', fontSize: '18px' }}>Please wait... This should only take a moment.</div>
      </div>
      )}
    </div>
  );
}

Knowledge.propTypes = {
  isUsedByManageContext: PropTypes.bool,
  openOrCloseManageKnowledgeWindow: PropTypes.func,
};

export default Knowledge;
