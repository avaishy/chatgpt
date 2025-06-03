
  const handleFileUpload = async (data) => {
    setIsUploading(true);

    if (data.fileInput.length === 0) return;
    const invalidFiles = !data.fileName?.toLowerCase().endsWith('.pdf');

    if (invalidFiles) {
      alert('Only PDF files are allowed.');
      setIsUploading(false);
      return;
    }
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
        dispatch(setLastestUploadedDocs(true));
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
     if(isUploadedNewDocs){
      setSelectedDocuments([result[0]]);
     }

    } catch (error) {
      console.log(error);
      toast.error('Please try again');
    } finally {
      setIsLoadingDocuments(false);
    }
  };
   {
        "file_id": 520,
        "file_name": "J-P-Morgan-4.pdf",
        "additional_info": {
            "company_name": "",
            "date": ""
        },
        "is_selected": false
    }

    [
    {
        "file_id": 520,
        "file_name": "J-P-Morgan-4.pdf",
        "additional_info": {
            "company_name": "",
            "date": ""
        },
        "is_selected": false
    },
    {
        "file_id": 517,
        "file_name": "J-P-Morgan-1.pdf",
        "additional_info": {
            "company_name": "",
            "date": ""
        },
        "is_selected": false
    },
    {
        "file_id": 519,
        "file_name": "J-P-Morgan-3.pdf",
        "additional_info": {
            "company_name": "",
            "date": ""
        },
        "is_selected": false
    },
    {
        "file_id": 518,
        "file_name": "J-P-Morgan-2.pdf",
        "additional_info": {
            "company_name": "",
            "date": ""
        },
        "is_selected": false
    },
    {
        "file_id": 516,
        "file_name": "N-Test-11.pdf",
        "additional_info": {
            "company_name": "",
            "date": ""
        },
        "is_selected": false
    }]
