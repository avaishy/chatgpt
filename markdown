<div className={containerClass}>
            <p className={`${styles.text}`}>Previous Session</p>
            {loadingSessions
              ? (
                <> <div className={styles.skeletonSession} />
                  <div className={styles.skeletonSession} />
                  <div className={styles.skeletonSession} />
                  <div className={styles.skeletonSession} />
                  <div className={styles.skeletonSession} />
                </>

              )
              : previousSessions.map((session) => (
                <div key={session.session_id} className={`${styles.navigationContainer}`}>
                  <button
                    key={session.session_id}
                    type="button"
                    className={`${styles.navigationItem} ${isSessionsId === session.session_id ? styles.activeButton : ''}`}
                    onClick={() => {
                      if (session.status === 'Completed') {
                        navigateToPreviousSession(session);
                      } else {
                        handleProcessingPreviousSession(session);
                      }
                    }}
                  >
                    <div className={styles.textWrapper}>
                      <p className={styles.sessionNames}>{session.session_name}</p>
                      <div className={styles.tooltip}>{session.session_name}</div>
                    </div>
                    {session.status !== 'Completed' && <MiniProcessingMessage />}
                  </button>
                </div>
              ))}
          </div>
