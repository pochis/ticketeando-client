export default function ({store,error}) {
  
 if (store.getters.loggedUser.role_id !== 1) {
     console.log(error);
      error({
          message: 'Usted no cuenta con permisos paa ver esta pagina',
          statusCode: 403
      })
  }
}