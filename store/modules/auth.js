'use strict';
import axios from 'axios';
import { setSession,unsetSession } from '~/utils/auth'

const state={
    user: null,
    token: null
}
const getters={
    
    isAuthenticated(state){
      return !!state.user
    },
    loggedUser (state) {
      return state.user
    }
};
const mutations={
    SET_USER(state, user) {
      state.user = user || null
    },
    SET_TOKEN(state,token){
      state.token = token || null
    }
}
const actions={
  async login({commit,rootState}, { email, password }) {
    try {
      const auth=await axios.post(rootState.endpoint+'auth', { email, password })
      setSession({
        token:auth.data.token,
        user:btoa(JSON.stringify(auth.data.user))
      });
      commit('SET_USER', auth.data.user);
      commit('SET_TOKEN', auth.data.token);
      
    } catch (error) {
        throw error
    }
  },
  async logout({state,commit,rootState},user) {
    try {
      const logout= await axios.post(rootState.endpoint+'logout',{user:user},{headers:{'Authorization': 'Bearer ' + state.token,'api-key':rootState.apikey}});
      commit('SET_USER', null);
      commit('SET_TOKEN', null);
      unsetSession();
    } catch (error){
        if (error.response) {
          throw new Error('Ha ocurrido un error inesperado, por favor vuelve a intetarlo mas tarde');
        }
        throw error
    }
  }
}
export default{
    state,
    getters,
    mutations,
    actions
}
