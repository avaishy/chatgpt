/* istanbul ignore file */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { connectAsync } from 'iguazu';
import oneAppModuleWrapper from '@americanexpress/one-app-module-wrapper';
import { IntlProvider } from 'react-intl';
import { loadLanguagePack } from '@americanexpress/one-app-ducks';
import PropTypes from 'prop-types';
import { ProgressCircle } from '@americanexpress/dls-react';
import { Helmet } from 'react-helmet';
import { Toaster } from 'react-hot-toast';
import childRoutes from '../childRoutes';
import Header from './header/Header';
import reducer from '../store/reducers';
import { AuthBlueSso } from './AuthBlue/AuthBlueSSO';

const Lumos = ({ languageData, locale, children }) => {
  if (Object.entries(languageData).length === 0) {
    return <ProgressCircle />;
  }

  return (
    <IntlProvider locale={locale} messages={languageData}>
      <Helmet
        htmlAttributes={{ lang: locale }}
        link={[
          {
            rel: 'stylesheet',
            href: 'https://www.aexp-static.com/cdaas/one/statics/@americanexpress/dls/6.21.5/package/dist/6.21.5/styles/dls.min.css',
          },
        ]}
      />
      <AuthBlueSso>
        <Header />
        {children}
      </AuthBlueSso>
      <Toaster />
    </IntlProvider>
  );
};

export const TestableLumos = Lumos;

Lumos.propTypes = {
  languageData: PropTypes.shape({}).isRequired, // no need to restate all the keys in the lang pack
  locale: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired,
};

// Read about childRoutes:
// https://github.com/americanexpress/one-app/blob/main/docs/api/modules/Routing.md#childroutes
Lumos.childRoutes = childRoutes;

// Read about appConfig:
// https://github.com/americanexpress/one-app/blob/main/docs/api/modules/App-Configuration.md
/* istanbul ignore next */
if (!global.BROWSER) {
  // eslint-disable-next-line global-require -- require needs to be inside browser check
  Lumos.appConfig = require('../appConfig').default;
}

export const loadModuleData = ({ store: { dispatch } }) => dispatch(loadLanguagePack('lumos', { fallbackLocale: 'en-US' }));
export const loadDataAsProps = ({ store: { dispatch } }) => dispatch(loadLanguagePack('research-assistant-root', { fallbackLocale: 'en-US' }));

export const mapDispatchToProps = () => ({
});

export const mapStateToProps = () => ({

});

const hocChain = compose(
  oneAppModuleWrapper('research-assistant-root'),
  connect(mapStateToProps, mapDispatchToProps),
  connectAsync({ loadDataAsProps })
);

Lumos.holocron = {
  name: 'research-assistant-root',
  reducer,
};

export default hocChain(Lumos);
user_id: null, project_type: "LUMOS", user_agent: "Windows 10", use_case: "Earnings Call Transcript",…}
no_of_chats
: 
10
project_type
: 
"LUMOS"
use_case
: 
"Earnings Call Transcript"
user_agent
: 
"Windows 10"
user_id
: 
null
/* istanbul ignore file */
import React, { useEffect } from 'react';
import { IconAccessibility } from '@americanexpress/dls-react';
import { Link } from '@americanexpress/one-app-router';
import { useAuthBlueSso } from 'use-authblue-sso';
import { useDispatch } from 'react-redux';
import { setUserId } from '../../store/actions/earningsCallTranscriptActions';
import { CONFIG } from '../../config';

function Header() {
  const { user } = useAuthBlueSso();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setUserId(user?.attributes?.adsId));
  }, []);

  const getDynamicLogoutUrl = () => {
    const destination = encodeURIComponent(CONFIG.LOGIN_URL);
    return `${CONFIG.LOGOUT_URL}?ssourl=${destination}`;
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      window.location.href = getDynamicLogoutUrl();
    }
  };

  return (
    <header
      id="dls-nav"
      className="nav nav-large  nav-header dls-white"
      role="banner"
      style={{ backgroundColor: '#222937' }}
    >
      <span className="margin-1-l margin-1-r"><Link to="/" style={{ color: 'white', textDecoration: 'None' }}>CFR Research Assistant</Link></span>
      <div style={{ display: 'flex', gap: '10px' }}>
        <h3>{user?.attributes?.adsId}</h3>
        <IconAccessibility title="Example icon" titleId="example-icon-id" className="margin-1-r" />
        <button
          type="button"
          onClick={handleLogout}
          style={{
            background: 'transparent',
            border: '1px solid white',
            color: 'white',
            padding: '4px 10px',
            cursor: 'pointer',
            marginRight: '10px',
          }}
        > Logout
        </button>
      </div>
    </header>
  );
}
export default Header;
useEffect(() => {
    if (userId) {
      getPreviousSessions();
      dispatch(setRefressPreviousSession(false));
    }
  }, [getPreviousSessions, shouldPreviousSessionRefresh, userId]);
const getPreviousSessions = useCallback(async () => {
    setLoadingSessions(true);
    dispatch(addUseCase('earnings_call_transcript'));
    const sessionsArray = [];
    let localUseCase = null;
    try {
      localUseCase = 'Earnings Call Transcript';
      const data = {
        user_id: userId,
        project_type: 'LUMOS',
        user_agent: 'Windows 10',
        use_case: localUseCase,
        no_of_chats: 10,
      };
      const res = await fetch(`${CONFIG.API_BASE_URL}/chats/get_user_session_chats`, { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } });
      if (res.ok) {
        const result = await res.json();
        result.forEach((ele) => {
          if (ele.session_name != null) {
            sessionsArray.push(ele);
          } else {
            sessionsArray.push('----');
          }
        });
        setPreviousSessions(sessionsArray);
        if (showCurrentSession && refreshCurrentSession) {
          const matchedSession = result.find(
            (session) => session.chats?.some(
              (chat) => chat.chat_id === selectedChat.chat_id
            )
          );

          if (matchedSession) {
            const matchedChat = matchedSession.chats.find(
              (chat) => chat.chat_id === selectedChat.chat_id
            );
            dispatch(setCurrentSessionDetails(matchedSession));
            dispatch(setCurrentChat(matchedSession.chats));
            if (matchedChat) {
              dispatch(setSelectedChat(matchedChat));
            }
            dispatch(setRefressCurrentSession(false));
          }
        }
      }
    } catch (error) {
      toast.error('Unable to load previous sessions');
    } finally {
      setLoadingSessions(false);
    }
  }, [shouldPreviousSessionRefresh]);
