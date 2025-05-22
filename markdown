
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
        setIsUploading(false);
        toast.success('Successfully uploaded file');
      } else {
        setIsUploading(false);
        const errorText = await response.text();
        console.log('Upload failed:', errorText);
        dispatch(setTogglePopup(true, 'Failed to upload file: server error'));
      }
    } catch (error) {
      setIsUploading(false);
      toast.error('Failed to upload file: network error');
    }
  };
