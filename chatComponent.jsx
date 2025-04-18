/* istanbul ignore file */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import ProcessingAlert from '../utility/ProcessingAlert';
import lumosIcon from '../../../assets/images/LUMOS.jpg';
import {
  getChatMessages,
  getDocumentProcessingAlert,
  getSelectedChatDetails,
  getUserId,
} from '../../../store/selectors/earningsCallTranscriptSelectors';
import { setChatMessages } from '../../../store/actions/earningsCallTranscriptActions';
import styles from '../../../styles/chatComponent.scss';
import TypingIndicator from '../utility/TypingIndicator';
import LLMFeedback from '../utility/LLMFeedback';

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

  useEffect(() => {
    setMessages(userMessages);
    setFeedback(messages.feedback);
  }, [userMessages]);

  const handleSendMessage = async () => {
    const newMessages = [...messages, { role: 'user', msg: { user_query: input }, msg_id: Math.random() }];
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
        if (!res.ok) {
          const errorBody = await res.json();
          console.log('>>>>', errorBody);
          throw new Error(errorBody?.message?.detail || 'Something went wrong while fetching response');
        }
        if (res.ok) {
          const result = await res.json();
          const botMessage = { role: 'llm', msg: { response: result.llm_response.response, sources: result.llm_response.sources }, msg_id: result.llm_response_id };
          const updatedMessages = [...newMessages, botMessage];
          setMessages(updatedMessages);
          dispatch(setChatMessages(updatedMessages));
        }
      } catch (error) { toast.error(`unable to fetch llm response : ${error}`); }
      setIsTyping(false);
    }
  };

  const handleMessageFeedback = (feedback, messageId) => {
    const newMessages = [];
    messages.forEach((item) => {
      if (item.id === messageId) {
        item.feedback = feedback;
        newMessages.push(item);
      } else {
        newMessages.push(item);
      }
    });
    setMessages(newMessages);
  console.log("Message Id in chat component", messageId);

  };

  console.log("Feeedback in chat component", feedback);
  console.log("Message in chat component", messages);

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
    let userRating = 0;
    if (feedback.thumbsup === true) {
      userRating = 1;
    }
    if (feedback.thumbsdown === true) {
      userRating = 0;
    }
    try {
      const data = {
        msg_id: message.id,
        user_rating: userRating,
        user_comments: feedback.comment,
      };
      const res = await fetch(
        'https://lumosusersessionmgmt-dev.aexp.com/insertUserFeedback', { 
         method: 'POST',
         body: JSON.stringify(data),
         headers: { 'Content-Type': 'application/json' } 
        });
      if (res.ok) {
        const newFeedback = { ...feedback, submitted: true };
        setFeedback(newFeedback);
        console.log("Message in api",messages);
        handleMessageFeedback(newFeedback, messages.id);
      }
    } catch (error) {
      console.log(error);
    }
  };
  console.log("Message in api",messages);

  return (
    <div className={`${styles.chatContainer}`}>
      <div className={`${styles.chatAndInputBoxContainer}`}>
        <div className={`${styles.chatMessages}`}>
          {isTyping && <TypingIndicator /> }
          {[...messages].reverse().map((message) => (
            <div
              key={message.msg_id}
              className={`${styles.chatMessage} ${message.role === 'llm'
                ? styles.botMessage
                : styles.userMessage
              }`}
            >
              <div className={styles.iconContainer}>
                {message.role === 'llm' ? (
                  <div className={styles.botIcon} style={{ backgroundImage: `url(${lumosIcon})` }} />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className={styles.userIcon}
                  >
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                )}
              </div>
              <div className={styles.messageContent}>
                {message.role === 'llm' ? (
                  <div ><ReactMarkdown>
                  {cleanText(message.msg.response)}
                </ReactMarkdown>
                 <LLMFeedback handleMessageFeedback={handleMessageFeedback} messageId={message.msg_id} feedback={messages.feedback} /> 
                 </div>
                )
                  : message.msg.user_query}
              </div>
              {feedback.thumbsup === true || feedback.thumbsdown === true
        ? (
          <div className={styles.feedbackContainer}>
            <span style={{ color: 'darkgray' }}>Please share your comments for us to improve</span>
            <div className={styles.feedbackInputContainer}>
              <textarea
                className={styles.feedbackInput}
                disabled={feedback.submitted}
                onChange={(event) => setFeedback({ ...feedback, comment: event.target.value })}
              >
                {feedback.comment}
              </textarea>
              <button
                type="button"
                className={styles.feedbackSubmit}
                onClick={handleUserFeedback}
                disabled={feedback.submitted}
              >{feedback.submitted === true ? 'Submitted' : 'submit'}
              </button>
            </div>
          </div>
        ) : null}
             
            </div>
          ))}
        </div>
        {processingDocumentAlert.show === true ? <ProcessingAlert message={processingDocumentAlert.message} messageType="warning" /> : (
          <div className={`${styles.inputContainer}`}>
            <input
              type="text"
              className={`${styles.inputBox}`}
              placeholder="Ask follow up questions..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isTyping) handleSendMessage();
              }}
              disabled={isTyping}
            />
            <button
              type="button"
              className={`${styles.sendIcon}`}
              onClick={handleSendMessage}
              aria-label="Send message"
              disabled={isTyping}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className={`${input.trim() !== ''
                  ? styles.icon
                  : styles.disabledIcon
                }`}
              >
                <path d="M2 21L23 12L2 3V10L17 12L2 14V21Z" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatComponent;
