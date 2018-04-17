import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios';
import auth from './modules/auth'

Vue.use(Vuex)


const store = () => new Vuex.Store({
  state: {
    assetUrl:'http://ticketeando-server-pochis852.c9users.io/', 
    endpoint:'http://ticketeando-server-pochis852.c9users.io/api/v1/',
    apikey:"59spiNcjCGfHttAP3aLpZY169a1iKch2c5lrp74D",
    notifications:[],
    totalNotifications:0,
    hasNotification:false
  },
  getters: {
    getNotifications(state){
      return state.notifications;
    }
  },
  mutations: {
    setNotification (state,data){
      state.totalNotifications = data.total;
      state.notifications = data.notifications;
      state.hasNotification= data.total > 0 ? true : false
    }
  },
  actions: {
    async getNotifications({state,commit},headers) {
      try {
        headers.headers['api-key']=state.apikey;
        const notificationsData= await axios.get(state.endpoint+'notifications/0/10',headers);
        commit('setNotification', notificationsData.data);
        
      } catch (error){
          if (error.response) {
            throw new Error('Ha ocurrido un error inesperado, por favor vuelve a intetarlo mas tarde');
          }
          throw error
      }
    }
  },
  modules:{
      auth
  },

})

export default store