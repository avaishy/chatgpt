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
                  <div >
                    <ReactMarkdown>{cleanText(message.msg.response)}</ReactMarkdown>
                    {message.msg_id === lastestMessageLLMMessageId ? (
                      <LLMFeedback handleMessageFeedback={handleMessageFeedback} messageId={message.msg_id} feedback={message.feedback} />
                    ) : null}
                  </div>
                )
                  : message.msg.user_query}
              </div>
             

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
        <div>
          {[...messages].reverse().map((message) => (
           {message.feedback && (message.feedback.thumbsup === true || message.feedback.thumbsdown === true)
                ? (
                  <div className={styles.feedbackContainer}>
                    <span style={{ color: 'darkgray' }}>Please share your comments for us to improve</span>
                    <div className={styles.feedbackInputContainer}>
                      <textarea
                        className={styles.feedbackInput}
                        disabled={message.feedback.submitted}
                        onChange={(event) => setFeedback({ ...feedback, comment: event.target.value })}
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
              ))}
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
