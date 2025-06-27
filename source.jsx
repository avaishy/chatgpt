i dont have res.status in catch block i have this onlyPOST https://lumosusersessionmgmt-dev.aexp.com/chats/get_user_session_chats net::ERR_FAILED 402 (Payment Required)

   so this perticular line not trigger so i want to check in catch is error is like this then alert if (res.status === 402) {
        setUiDisable(true);
        window.alert('Unauthorized User - Please raise IIQ request for PRC-AXP-EH-E3-AppUser-paas-lumos-project');
      }
    } catch (error) {
      console.log(error);
      toast.error('Unable to load previous sessions');
    } 
