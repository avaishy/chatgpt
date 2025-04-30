  <div>
                      {Array.isArray(message.msg.response) && Array.isArray(message.msg.sources)
                        ? message.msg.response.map((resp, idx) => {
                          const source = message.msg.sources?.[0] || {};
                          const citation = source?.citation?.[idx];
                          const reasoning = source?.reasoning?.[idx];

                          return (
                            <div key={idx} className={`${styles.responseBlock}`}>
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
{message.role === 'llm' ? (
                <div className={styles.toggleContainer}>
                  <div className={styles.toggleLabel}>Show Reasoning</div>
                  <label className={styles.switch}>
                    <input
                      type="checkbox"
                      checked={message.showReasoning}
                      onChange={() => toggleShowReasoning(message.msg_id)}
                    />
                    <span className={styles.slider}>
                      {message.showReasoning ? 'On' : 'Off'}
                    </span>
                  </label>
                </div>
              ) : null}ay. You can also replace multiple useState variables with useReducer if 'setFeedback' needs the current value of 'messages.feedback' 
 react-hooks/exhaustive-deps
  206:39  error    Do not use Array index in keys

 react/no-array-index-key
  278:19  error    A form label must be associated with a control

 jsx-a11y/label-has-associated-control
