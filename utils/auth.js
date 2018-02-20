import Cookie from 'js-cookie';

const getQueryParams = () => {
  const params = {}
  window.location.href.replace(/([^(?|#)=&]+)(=([^&]*))?/g, ($0, $1, $2, $3) => {
    params[$1] = $3
  })
  return params
}

export const setToken = (token) => {
  if (process.SERVER_BUILD) return
  window.localStorage.setItem('token', token);
  Cookie.set('token', token);
}

export const unsetToken = () => {
  if (process.SERVER_BUILD) return
  window.localStorage.removeItem('token');
  Cookie.remove('token');
}

export const getUserFromCookie = (req) => {
  if (!req.headers.cookie) return
  const tokenCookie = req.headers.cookie.split(';').find(c => c.trim().startsWith('token='))
  if (!tokenCookie) return
  const user = Buffer.from(tokenCookie.split('=')[1], 'base64').toString().split('~');
  return JSON.parse(user[0]);
}

export const getUserFromLocalStorage = () => {
  const json = (window.localStorage.token) ? atob(window.localStorage.token).split('~') : null;
  return json ? JSON.parse(json[0]) : undefined
}

export const getTokenFromCookie = (req) =>{
  if (!req.headers.cookie) return
  const tokenCookie = req.headers.cookie.split(';').find(c => c.trim().startsWith('token='))
  return tokenCookie.split('=')[1]
}
export const getTokenFromLocalStorage = () => {
  return window.localStorage.token
}

export const checkToken = (token) => window.localStorage.token === token