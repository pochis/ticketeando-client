import Cookie from 'js-cookie';

const getQueryParams = () => {
  const params = {}
  window.location.href.replace(/([^(?|#)=&]+)(=([^&]*))?/g, ($0, $1, $2, $3) => {
    params[$1] = $3
  })
  return params
}

export const setSession = (payload) => {
  if (process.SERVER_BUILD) return
  window.localStorage.setItem('token', payload.token);
  window.localStorage.setItem('user', payload.user);
  Cookie.set('token', payload.token);
  Cookie.set('user', payload.user);
}
export const unsetSession = () => {
  if (process.SERVER_BUILD) return
  window.localStorage.removeItem('token');
  window.localStorage.removeItem('user');
  Cookie.remove('token', { path: '/' });
  Cookie.remove('user', { path: '/' });
}

export const getUserFromCookie = (req) => {
  if (!req.headers.cookie) return
  const userCookie = req.headers.cookie.split(';').find(c => c.trim().startsWith('user='))
  if (!userCookie) return
  const user = Buffer.from(userCookie.split('user=')[1], 'base64').toString();
  return JSON.parse(user);
}

export const getUserFromLocalStorage = () => {
  const json = (window.localStorage.user) ? Buffer.from(window.localStorage.user, 'base64').toString() : null;
  return json ? JSON.parse(json) : undefined
}

export const getTokenFromCookie = (req) =>{
  if (!req.headers.cookie) return
  const tokenCookie = req.headers.cookie.split(';').find(c => c.trim().startsWith('token='))
  return tokenCookie.split('token=')[1]
}
export const getTokenFromLocalStorage = () => {
  return window.localStorage.token
}

export const checkToken = (token) => window.localStorage.token === token