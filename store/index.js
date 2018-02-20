import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth'

Vue.use(Vuex)


const store = () => new Vuex.Store({

  state: {
    endpoint:'http://ticketeando-server-pochis852.c9users.io/api/v1/'
  },

  mutations: {
    
  },

  actions: {
    
  },
  modules:{
      auth
  },

})

export default store