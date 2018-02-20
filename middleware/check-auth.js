import { getUserFromCookie, getUserFromLocalStorage,getTokenFromCookie,getTokenFromLocalStorage } from '~/utils/auth'

export default function ({store, req }) {
   
  if (process.server && !req) return

    const loggedUser = (process.server) ? getUserFromCookie(req) : getUserFromLocalStorage()
    const userToken = (process.server) ? getTokenFromCookie(req) : getTokenFromLocalStorage()
    
    store.commit('SET_USER', loggedUser);
    store.commit('SET_TOKEN', userToken);
}