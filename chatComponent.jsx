/* istanbul ignore file */
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
    setMessages(userMessages);
    setFeedback(messages.feedback);
  }, [userMessages]);
  return (
    <div className={`${styles.chatContainer}`}>
      <div className={`${styles.chatAndInputBoxContainer}`}>
        <div className={`${styles.chatMessages}`}>
          {isTyping && <TypingIndicator />}
          {[...messages].reverse().map((message) => (
            <div
              key={message.msg_id}
              className={`${styles.chatMessage} ${message.role === 'llm'
                ? styles.botMessage
                : styles.userMessage
              }`}
            >
              <div className={styles.iconAndMessageContent}>
                <div className={message.role === 'llm' ? styles.iconContainer : ''}>
                  {message.role === 'llm' ? (
                    <div className={styles.botIcon} style={{ backgroundImage: `url(${lumosIcon})` }} />
                  ) : null }
                </div>
                <div className={styles.messageContent}>
                  {message.role === 'llm'
                && Array.isArray(message.msg.sources)
                && message.msg.sources.some(
                  (src) => Array.isArray(src.citation) && src.citation.length > 0
                ) && (
                  <div className={styles.toggleContainer}>
                    <div className={styles.toggleLabel}>Show Reasoning</div>
                    <label className={styles.switch} htmlFor={`toggle-${message.msg_id}`}>
                      <input
                        id={`toggle-${message.msg_id}`}
                        type="checkbox"
                        checked={message.showReasoning}
                        onChange={() => toggleShowReasoning(message.msg_id)}
                      />
                      <span className={styles.slider}>
                        {message.showReasoning ? 'On' : 'Off'}
                      </span>
                    </label>
                  </div>
                  )}

                  {message.role === 'llm' ? (
                    <div>

                      {message.msg.header && (
                        <div className={`${styles.header}`}><ReactMarkdown>{cleanText(message.msg.header)}</ReactMarkdown></div>
                      )}
                      {Array.isArray(message.msg.response) && Array.isArray(message.msg.sources)
                        ? message.msg.response.map((resp, idx) => {
                          const source = message.msg.sources?.[0] || {};
                          const citation = source?.citation?.[idx];
                          const reasoning = source?.reasoning?.[idx];
                          const key = `${typeof resp === 'string' ? resp.slice(0, 20) : JSON.stringify(resp).slice(0, 20)}-${idx}`;
                          return (
                            <div key={key} className={`${styles.responseBlock}`}>
                              <ReactMarkdown>{resp}</ReactMarkdown>

                              {message.showReasoning && citation && (
                              <div className={`${styles.citationBox}`}>
                                <strong>Citation:</strong>
                                <span className={`${styles.citationContent}`}>
                                  <ReactMarkdown>{citation}</ReactMarkdown>
                                </span>
                              </div>
                              )}

                              {message.showReasoning && reasoning && (
                              <div className={`${styles.reasoningBox}`}>
                                <strong>Reasoning:</strong>
                                <span className={`${styles.reasoningContent}`}>
                                  <ReactMarkdown>{reasoning}</ReactMarkdown>
                                </span>
                              </div>
                              )}
                            </div>
                          );
                        })
                        : (
                          <ReactMarkdown>{cleanText(message.msg.response)}</ReactMarkdown>
                        )}

                      {message.msg_id === lastestMessageLLMMessageId ? (
                        <LLMFeedback
                          handleMessageFeedback={handleMessageFeedback}
                          messageId={message.msg_id}
                          feedback={message.feedback}
                          isDisableInput={setIsDisableInput}
                        />
                      ) : null}
                    </div>
                  )
                    : message.msg.user_query }
                </div>
              </div>

              {message.feedback && message.feedback.submitted !== true
               && (message.feedback.thumbsup === true || message.feedback.thumbsdown === true)
                ? (
                  <div className={styles.feedbackContainer}>
                    <span style={{ color: 'darkgray' }}>Please share your comments for us to improve</span>
                    <div className={styles.feedbackInputContainer}>
                      <textarea
                        className={styles.feedbackInput}
                        disabled={message.feedback.submitted}
                        onChange={(event) => setFeedback({
                          ...feedback,
                          comment: event.target.value,
                        })}
                      >
                        {message.feedback.comment}
                      </textarea>
                      <button
                        type="button"
                        className={styles.feedbackSubmit}
                        onClick={handleUserFeedback}
                        disabled={message.feedback.submitted}
                      >

                        {message.feedback.submitted === true ? 'Submitted' : 'submit'}
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
                if (e.key === 'Enter' && !isTyping && input.trim() !== '') handleSendMessage();
              }}
              disabled={(isTyping || isDisableInput)}
            />
            <button
              type="button"
              className={`${styles.sendIcon}`}
              onClick={handleSendMessage}
              aria-label="Send message"
              disabled={isTyping || input.trim() === ''}
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
        <div />
      </div>
      {isPopupOpen && (
      <PopUpMessage message={popupMessage} />
      )}
    </div>
  );
};

export default ChatComponent;
