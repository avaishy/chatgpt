/* istanbul ignore file */
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from '@americanexpress/one-app-router';
import { toast } from 'react-hot-toast';
import PropTypes, { bool } from 'prop-types';
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
  setDocumentProcessingAlert,
  setChatMessages,
  setAllBotSourcesArray,
  setCurrentChat,
  setAllUserFiles,
  setFileProcessingStatus,
  toggleEditContextButton,
  setTogglePopup,
  setToggleFileUpload,
  setToggleGeneratePopup,
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
  getToggleGeneratePopup,
} from '../../../store/selectors/earningsCallTranscriptSelectors';
import FileUpload from './FileUpload';
import PopupMessage from '../utility/PopUpMessage';
import Timer from '../utility/Timer';
import PopUpMessageGenerateAnswer from '../utility/PopUpMessageGenerateAnswer';

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
  const {
    showGeneratePopup: isGeneratePopupOpen,
    messageGeneratePopup: generatePopupMessage,
  } = useSelector((state) => getToggleGeneratePopup(state));
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
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const pollingIntervalsRef = useRef({});
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(true);
  const isToggleFileUpload = useSelector((state) => getToggleFileUpload(state));
  const [isUploading, setIsUploading] = useState(false);
  const [showPopup, setShowPopup] = useState(true);
  const [isGenerate, setIsGenerate] = useState(true);


  showPopup
  function addSelectedDocuments(document) {
    setSelectedDocuments([document]);
  }
  function toggleFileUploadComponent(condition) {
    dispatch(setToggleFileUpload(condition));
  }
  const startPolling = (filename) => {
    setInterval(async () => {
      try {
        const response = await fetch(`https://lumosusersessionmgmt-dev.aexp.com/getFileStatus/${filename}`, {
          method: 'GET',
          headers: { accept: 'application/json' },
        });

        const result = await response.json();

        if (result.is_indexed === true) {
          setUploadedFiles((prevFiles) => {
            const updatedFiles = prevFiles.map((file) => (file.filename === filename
              ? { ...file, isIndexing: false }
              : file));

            return updatedFiles;
          });
          console.log('Uploaded Files', uploadedFiles);
          clearInterval(pollingIntervalsRef.current[filename]);
          delete pollingIntervalsRef.current[filename];
        }
      } catch (error) {
        toast.error(`Polling error for ${filename}:`, error);
      }
    }, 30000);
  };

  const handleFileUpload = async (data) => {
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
      setIsUploading(true);
      const response = await fetch('https://lumosusersessionmgmt-dev.aexp.com/uploadFiles', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        dispatch(setToggleFileUpload(false));
        dispatch(setFileProcessingStatus(true));
        const uploadedName = data.fileName;
        const updatedFileName = `${uploadedName}`;
        setUploadedFiles((prevFiles) => {
          const newFiles = [...prevFiles, {
            filename: updatedFileName,
            isIndexing: true,
            user_id: userId,
          }];
          return newFiles;
        });
        startPolling(updatedFileName);
        if (renderComponent === true) {
          setRenderComponent(false);
        } else {
          setRenderComponent(true);
        }
        dispatch(setToggleGeneratePopup({showGeneratePopup: true, messageGeneratePopup:'Do you want to add additional knowledge about company,industry or personal knowledge'}));
        //generateAnswerAfterUpload();

        toast.success('Successfully uploaded file');
      } else {
        const errorText = await response.text();
        console.log('Upload failed:', errorText);
        dispatch(setTogglePopup(true, 'Failed to upload file: server error'));
      }
    } catch (error) {
      toast.error('Failed to upload file: network error');
    } finally {
      setIsUploading(false);
    }
  };

  const getAllUserDocuments = async () => {
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
  };

  const getUserAdditionalKnowledge = async () => {
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
  };

  useEffect(() => {
    getAllUserDocuments();
    getUserAdditionalKnowledge();
    if (isUsedByManageContext === true) {
      setSelectedDocuments(userSelectedDocumentsFromReduxStore);
    }

    return () => {
      Object.values(pollingIntervalsRef.current).forEach(clearInterval);
    };
  }, [renderComponent,selectedDocuments]);

  const closeNewSession = () => {
    if (isUsedByManageContext === false) {
      dispatch(toggleNewSession(false));
    } else {
      dispatch(setDocumentProcessingAlert({ show: true, message: 'Processing the predefined document template. You will be able to ask follow up questions once the newly processes predefined document template is ready' }));
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

  const openChatCompoent = async () => {
    if (!selectedDocuments || selectedDocuments.length === 0) {
      console.warn('Cannot Generate predefine response - no document selected');
      return;
    }
    if (isUsedByManageContext === false) {
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
      const fileStatuses = await fetchFileStatuses();
      const notIndexedFiles = selectedDocuments.filter((doc) => {
        const statusEntry = fileStatuses.find((indexFile) => indexFile.file_id === doc.file_id);
        return statusEntry && statusEntry.status !== 'Completed';
      });
      if (notIndexedFiles.length > 0) {
        const filesName = notIndexedFiles.map((doc) => doc.file_name).join(', ');
        dispatch(setTogglePopup(true, `These files are still indexing: ${filesName}. Please wait until indexing is completed.`));
        return;
      }

      dispatch(setChatMessages([]));
      dispatch(setAllBotSourcesArray([]));
      dispatch(setCurrentSessionDetails({}));
      dispatch(setCurrentChat([]));
      const fileIds = [];
      let useCaseTemp = null;
      const seletedContexts = [...seletedCompanyKnowldge,
        ...seletedIndustryKnowldge, ...seletedPersonalKnowldge];
      const seletedContextIds = [];
      seletedContexts.forEach((ele) => {
        seletedContextIds.push(ele.context_id);
      });
      if (selectedDocuments.length > 0) {
        selectedDocuments.forEach((ele) => {
          fileIds.push(ele.file_id);
        });
      }

      if (useCase === 'earnings_call_transcript') {
        useCaseTemp = 'Earnings Call Transcript';
      }
      const data = {
        user_id: userId,
        user_agent: 'Windows 10',
        project_type: 'LUMOS',
        use_case: useCaseTemp,
        files_selected: fileIds,
        contexts_selected: seletedContextIds,
        industry_selected: industryType,
      };
      dispatch(setUserSelectedDocumentsForChat(selectedDocuments));
      dispatch(toggleNewSession(false));
      dispatch(toggleEditContextButton(true));
      dispatch(toggleChatComponent(true));
      dispatch(setDocumentProcessingAlert({ show: true, message: 'Processing the predefined document template. You will be able to ask follow up questions once the newly processes predefined document template is ready' }));
      try {
        const res = await fetch('https://lumosusersessionmgmt-dev.aexp.com/createChatSession', { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } });
        if (res.ok) {
          const result = await res.json();
          dispatch(setCurrentSessionDetails(result));
          dispatch(setDocumentProcessingAlert({ show: false, message: '' }));
          dispatch(setCurrentChat(result.chats));
          dispatch(toggleEditContextButton(false));
        } else {
          dispatch(toggleChatComponent(false));
          dispatch(setDocumentProcessingAlert({ show: false, message: '' }));
          if (res.status === 422) {
            toast.error('Unprocessable Entity: Invalid input provided');
          } else if (res.status === 500) {
            toast.error('Server Error: Something went wrong');
          } else {
            toast.error('Please try again later');
          }
        }
      } catch (error) {
        dispatch(toggleChatComponent(false));
        dispatch(setDocumentProcessingAlert({ show: false, message: '' }));
        console.error('Network error: Something went wrong', error);
        toast.error('Network error: Something went wrong');
      }
    } else {
      try {
        const fileIds = [];
        const seletedContexts = [...seletedCompanyKnowldge,
          ...seletedIndustryKnowldge, ...seletedPersonalKnowldge];
        const seletedContextIds = [];
        seletedContexts.forEach((ele) => {
          seletedContextIds.push(ele.context_id);
        });
        if (selectedDocuments.length > 0) {
          selectedDocuments.forEach((ele) => {
            fileIds.push(ele.file_id);
          });
        }

        const data = {
          user_id: userId,
          chat_id: selectedChat.chat_id,
          files_selected: fileIds,
          contexts_selected: seletedContextIds,
          industry_selected: industryType,
        };
        const allSelectedDocs = isUsedByManageContext
          ? [
            ...userSelectedDocumentsFromReduxStore,
            ...selectedDocuments.filter(
              (doc) => !userSelectedDocumentsFromReduxStore.some((d) => d.file_id === doc.file_id)
            ),
          ] : selectedDocuments;
        dispatch(setUserSelectedDocumentsForChat(allSelectedDocs));
        openOrCloseManageKnowledgeWindow(false);
        const res = await fetch('https://lumosusersessionmgmt-dev.aexp.com/manageChatContext', { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } });
        if (res.ok) {
          const updatedChatsArray = getUpdatedChatsArray({
            previousChatsArray: currentChatsArray,
            chatId: selectedChat.chat_id,
            seletedContexts,
            selectedDocuments,
          });
          dispatch(setCurrentChat(updatedChatsArray));
          const result = await res.json();
          if (result.status === 'Success') { toast.success('Updated Successfully'); }
        } else {
          toast.error('Something went wrong: Invalid Inputs');
        }
      } catch (error) { toast.error('Something went wrong while opening chat components'); }
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

  const generateAnswerAfterUpload = () =>{
      const matchingDoc = allUserDocuments[0];
      if(matchingDoc && isGenerate){
        setIsGenerate(false);
        console.log('matchingDoc',matchingDoc);
        setSelectedDocuments([matchingDoc]);
      }
    
  }
  if(showPopup){
    generateAnswerAfterUpload();
  }

  function handleClose(){
    //dispatch(setToggleGeneratePopup({show: false, message: ''}))
  
  }
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
                      type="radio"
                      name="documentSelection"
                      id={`doc-${index}`}
                      onChange={() => addSelectedDocuments(doc)}
                      checked={selectedDocuments[0]?.file_id === doc.file_id}
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
                      checked={filteredDocuments[0]}

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
          onClick={openChatCompoent}
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
          <div style={{
            color: 'white',
            fontSize: '18px',
          }}
          >
            These file take 5-6 minutes to index. Please wait until indexing is completed.
          </div>
          <Timer fontColor="white" />
        </div>
      )}
      {isGeneratePopupOpen && ( isUsedByManageContext === false ?(
      <PopUpMessageGenerateAnswer
       message= {generatePopupMessage}
       onNo={openChatCompoent}
       onYes={handleClose}
       ></PopUpMessageGenerateAnswer>
      ) : null )}
    </div>
  );
}

Knowledge.propTypes = {
  isUsedByManageContext: PropTypes.bool,
  openOrCloseManageKnowledgeWindow: PropTypes.func,
};

export default Knowledge;
