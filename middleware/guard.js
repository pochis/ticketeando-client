export default function ({store,redirect }) {
  
 
 if (!store.getters.isAuthenticated) {
      return redirect('/login');
  }
}

/*https://github.com/nuxt/example-auth0/blob/master/utils/auth.js*/