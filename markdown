let API_BASE_URL = '';
let LOGOUT_URL = '';
let LOGIN_URL = '';
let ENV = 'dev';

const hostname = window?.location?.hostname;

if (hostname.includes('cfrassistant-dev')) {
  API_BASE_URL = 'https://lumosusersessionmgmt-dev.aexp.com';
  LOGOUT_URL = 'https://ssoisvc-dev.aexp.com/ssoi/logoff';
  LOGIN_URL = 'https://cfrassistant-dev.aexp.com';
  ENV = 'dev';
} else if (hostname.includes('cfrassistant-qa')) {
  API_BASE_URL = 'https://lumosusersessionmgmt-qa.aexp.com';
  LOGOUT_URL = 'https://authbluesvcqa-vip.phx.aexp.com/ssoi/logoff';
  LOGIN_URL = 'https://cfrassistant-qa.aexp.com';
  ENV = 'qa';
} else {
  console.warn('Unknown environment, defaulting to dev');
  API_BASE_URL = 'https://lumosusersessionmgmt-dev.aexp.com';
  LOGOUT_URL = 'https://ssoisvc-dev.aexp.com/ssoi/logoff';
  LOGIN_URL = 'https://cfrassistant-dev.aexp.com';
  ENV = 'dev';
}

export const CONFIG = {
  API_BASE_URL,
  LOGOUT_URL,
  LOGIN_URL,
  ENV,
};
import { CONFIG } from '../config';

const getDynamicLogoutUrl = () => {
  const destination = encodeURIComponent(CONFIG.LOGIN_URL);
  return `${CONFIG.LOGOUT_URL}?ssourl=${destination}`;
};

const handleLogout = () => {
  localStorage.clear();
  window.location.href = getDynamicLogoutUrl();
};
