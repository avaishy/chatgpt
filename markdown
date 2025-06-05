const getDynamicLogoutUrl = () => {
  const target = encodeURIComponent(window.location.origin); // Redirect back here after login
  const authUrl = `https://authbluesvcqa-vip.phx.aexp.com/ssoi/auth?method=GET&requestid=3746b736-889d-448e-962b-65ae57e5ce5a&target=${target}`;
  const logoutUrl = `https://authbluesvcqa-vip.phx.aexp.com/ssoi/logoff?ssourl=${encodeURIComponent(authUrl)}`;
  return logoutUrl;
};