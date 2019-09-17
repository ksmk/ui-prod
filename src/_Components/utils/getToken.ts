export const getToken = () =>
  typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;

function parseJwt(token) {
  if (!token) return false;
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  return JSON.parse(window.atob(base64));
}

export const getTokenId = () => {
  const jwtToken = getToken();
  return jwtToken && parseJwt(jwtToken).id;
  return null;
};
