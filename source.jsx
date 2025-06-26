 const res = await fetch(`${CONFIG.API_BASE_URL}/chats/get_user_session_chats`,
        { method: 'POST',
          credentials: 'include',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'text/plain'
          } });
