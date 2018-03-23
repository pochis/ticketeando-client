import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth'

Vue.use(Vuex)


const store = () => new Vuex.Store({
  state: {
    assetUrl:'http://ticketeando-server-pochis852.c9users.io/', 
    endpoint:'http://ticketeando-server-pochis852.c9users.io/api/v1/',
    apikey:"59spiNcjCGfHttAP3aLpZY169a1iKch2c5lrp74D"
  },
  modules:{
      auth
  },

})

export default store