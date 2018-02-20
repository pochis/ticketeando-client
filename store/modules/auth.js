'use strict';
import axios from 'axios'
import { setToken,unsetToken } from '~/utils/auth'

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
      
      var json =atob(auth.data.token).split('~');
      json =JSON.parse(json[0])
      setToken(auth.data.token);
      
      commit('SET_USER', json);
      commit('SET_TOKEN', auth.data.token);
      
    } catch (error) {
      if (error.response) {
        throw new Error('La dirección de correo electrónico o contraseña ingresada es incorrecta. Inténtalo nuevamente.')
      }
      throw error
    }
  },

  async logout({state,commit,rootState },{userId}) {
    try{
      const logout= await axios.post(rootState.endpoint+'logout',{ userId },{headers:{Authorization: 'Bearer ' + state.token}});
        commit('SET_USER', null);
        commit('SET_TOKEN', null);
        unsetToken();
      
    }catch (error){
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
