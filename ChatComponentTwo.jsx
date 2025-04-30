  {Array.isArray(message.msg.response) && Array.isArray(message.msg.sources)
                        ? message.msg.response.map((resp, idx) => {
                          const source = message.msg.sources?.[0] || {};
                          const citation = source?.citation?.[idx];
                          const reasoning = source?.reasoning?.[idx];
                          const key = `${resp.slice(0, 20)}-${idx}`;
                          return (
                            <div className={`${styles.responseBlock}`}>
                              <ReactMarkdown>{resp}</ReactMarkdown>

                              {message.showReasoning && citation && (
                              <div className={`${styles.citationBox}`}>
                                <strong>Citation:</strong>
                                <span className={`${styles.citationContent}`}>
                                  <ReactMarkdown>{citation}</ReactMarkdown>
                                </span>
                              </div>
                              )}
