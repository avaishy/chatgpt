onClick={() => {
        if (session.status === 'Completed') {
          navigateToPreviousSession(session);
        } else {
          handleProcessingPreviousSession(session);
        }
      }}