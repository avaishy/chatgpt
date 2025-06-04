userMessages 
(7) [{…}, {…}, {…}, {…}, {…}, {…}, {…}]
0
: 
{msg_id: '82b0d426-bf08-4e97-8181-b8a0689da4b9', msg: {…}, role: 'llm', user_rating: null, user_comments: null}
1
: 
{msg_id: '7818a77a-0ff6-4ce8-af21-9678216e10b6', msg: {…}, role: 'user', user_rating: null, user_comments: null}
2
: 
{msg_id: 'f73ec821-a92e-44a1-ad41-428feea6f28a', msg: {…}, role: 'llm', user_rating: null, user_comments: null}
3
: 
{msg_id: '61cf476d-e8fe-4fb5-9b40-2241821ad7d4', msg: {…}, role: 'user', user_rating: null, user_comments: null}
4
: 
{msg_id: '20dcb3f0-1312-4f47-b071-fade6dbc22c8', msg: {…}, role: 'llm', user_rating: null, user_comments: null}
5
: 
{role: 'user', msg: {…}, msg_id: 0.529565163970621, showReasoning: false}
6
: 
feedback
: 
{thumbsup: false, thumbsdown: false, comment: '', submitted: false}
msg
: 
{response: Array(4), sources: Array(1)}
msg_id
: 
"09bb8672-4c80-4b9b-8c11-a6b681738926"
role
: 
"llm"
[[Prototype]]
: 
Object
length
: 
7
[[Prototype]]
: 
Array(0)
ChatComponent.jsx:173 userMessages 
[{…}]
0
: 
{msg_id: 'd12e089d-2fe7-4dfd-b03d-dab42530ae3d', msg: {…}, role: 'llm', user_rating: null, user_comments: null}
length
: 
1
[[Prototype]]
: 
Array(0)
ChatComponent.jsx:173 userMessages 
(6) [{…}, {…}, {…}, {…}, {…}, {…}]
0
: 
{msg_id: '82b0d426-bf08-4e97-8181-b8a0689da4b9', msg: {…}, role: 'llm', user_rating: null, user_comments: null}
1
: 
{msg_id: '7818a77a-0ff6-4ce8-af21-9678216e10b6', msg: {…}, role: 'user', user_rating: null, user_comments: null}
2
: 
{msg_id: 'f73ec821-a92e-44a1-ad41-428feea6f28a', msg: {…}, role: 'llm', user_rating: null, user_comments: null}
3
: 
{msg_id: '61cf476d-e8fe-4fb5-9b40-2241821ad7d4', msg: {…}, role: 'user', user_rating: null, user_comments: null}
4
: 
{msg_id: '20dcb3f0-1312-4f47-b071-fade6dbc22c8', msg: {…}, role: 'llm', user_rating: null, user_comments: null}
5
: 
{msg_id: 'e05511f0-fe9d-4e07-ab86-4a6f4675b4ba', msg: {…}, role: 'user', user_rating: null, user_comments: null}
length
: 
6
[[Prototype]]
: 
Array(0)
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import ProcessingAlert from '../utility/ProcessingAlert';
import lumosIcon from '../../../assets/images/LUMOS.jpg';
import {
  getChatMessages,
  getDocumentProcessingAlert,
  getSelectedChatDetails,
  getUserId,
  getTogglePopup,
} from '../../../store/selectors/earningsCallTranscriptSelectors';
import { setChatMessages, setTogglePopup } from '../../../store/actions/earningsCallTranscriptActions';
import styles from '../../../styles/chatComponent.scss';
import TypingIndicator from '../utility/TypingIndicator';
import LLMFeedback from '../utility/LLMFeedback';
import PopUpMessage from '../utility/PopUpMessage';

const ChatComponent = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => getUserId(state));
  const selectedChat = useSelector((state) => getSelectedChatDetails(state));
  const userMessages = useSelector((state) => getChatMessages(state));
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const processingDocumentAlert = useSelector((state) => getDocumentProcessingAlert(state));
  const [feedback, setFeedback] = useState({});
  const lastestMessageLLMMessageId = [...messages].reverse().find((m) => m.role === 'llm')?.msg_id;
  const [isDisableInput, setIsDisableInput] = useState(false);
  const {
    show: isPopupOpen,
    message: popupMessage,
  } = useSelector((state) => getTogglePopup(state));
  const handleSendMessage = async () => {
    const newMessages = [...messages, {
      role: 'user', msg: { user_query: input }, msg_id: Math.random(), showReasoning: false,
    }];
    setMessages(newMessages);
    dispatch(setChatMessages(newMessages));
    if (input.trim()) {
      const userQuery = input;
      const fileIds = [];
      const contextIds = [];
      selectedChat.files_selected.forEach((ele) => {
        fileIds.push(ele.file_id);
      });
      selectedChat.contexts_selected.forEach((ele) => {
        contextIds.push(ele.context_id);
      });
      setInput('');
      try {
        const data = {
          chat_id: selectedChat.chat_id,
          files_selected: fileIds,
          user_query: userQuery,
          contexts_selected: contextIds,
          user_id: userId,
        };
        setIsTyping(true);
        const res = await fetch(
          'https://lumosusersessionmgmt-dev.aexp.com/fetchLLMResponse',
          {
            method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' },
          }
        );
        if (res.ok) {
          const result = await res.json();
          const botMessage = {
            role: 'llm',
            msg: { response: result.llm_response.response, sources: result.llm_response.sources },
            msg_id: result.llm_response_id,
            feedback: {
              thumbsup: false, thumbsdown: false, comment: '', submitted: false,
            },
          };
          const updatedMessages = [...newMessages, botMessage];
          setMessages(updatedMessages);
          dispatch(setChatMessages(updatedMessages));
        } else {
          dispatch(setTogglePopup(true, 'Unable to fetch llm response. Please try again later'));
        }
      } catch (error) { dispatch(setTogglePopup(true, 'Something went wrong. Please try again later')); }
      setIsTyping(false);
    }
  };
  const handleMessageFeedback = (fb, messageId) => {
    const newMessages = messages.map((item) => {
      if (item.msg_id === messageId) {
        return { ...item, feedback: fb };
      }
      return item;
    });
    setMessages(newMessages);
    setFeedback(fb);
  };

  const cleanText = (text) => {
    const unwrapJSON = (str) => {
      try {
        const parsed = JSON.parse(str);
        return typeof parsed === 'string' ? parsed : str;
      } catch {
        return str;
      }
    };

    let result = unwrapJSON(text);
    result = unwrapJSON(result);

    result = result
      .replace(/^```(?:markdown)?\s*/i, '')
      .replace(/\s*```$/g, '')
      .replace(/\\n/g, '\n')
      .replace(/\\t/g, '\t')
      .replace(/\\u2019/g, '’')
      .replace(/\\u201c/g, '“')
      .replace(/\\u201d/g, '”')
      .replace(/\\u2014/g, '—')
      .replace(/\\u2026/g, '…')
      .replace(/\\u00a0/g, ' ')
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, '\\');

    return result.trim();
  };

  const handleUserFeedback = async () => {
    setIsDisableInput(false);

    let userRating = 0;

    if (feedback.thumbsup === true) {
      userRating = 1;
    }
    if (feedback.thumbsdown === true) {
      userRating = 0;
    }
    try {
      const data = {
        msg_id: messages[messages.length - 1]?.msg_id,
        user_rating: userRating,
        user_comments: feedback.comment,
      };
      const res = await fetch(
        'https://lumosusersessionmgmt-dev.aexp.com/insertUserFeedback', {
          method: 'POST',
          body: JSON.stringify(data),
          headers: { 'Content-Type': 'application/json' },
        });
      if (res.ok) {
        const newFeedback = { ...feedback, submitted: true };
        setFeedback(newFeedback);
        handleMessageFeedback(newFeedback, messages[messages.length - 1]?.msg_id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const toggleShowReasoning = (msgId) => {
    const updatedMessage = messages.map((msg) => {
      if (msg.msg_id === msgId) {
        return { ...msg, showReasoning: !msg.showReasoning };
      }
      return msg;
    });
    setMessages(updatedMessage);
  };
  useEffect(() => {
    console.log('userMessages',userMessages);
    setMessages(userMessages);
    setFeedback(messages.feedback);
  }, [userMessages]);
