<template>
    <v-layout row wrap>
     <v-flex xs12 md12>
      <v-toolbar  color="accent" height="45px">
          <v-toolbar-title class="title_toolbar">Usuarios</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn outline small color="primary" to="/user/new">
           <v-icon>person_add</v-icon>
           Agregar usuario
          </v-btn>
      </v-toolbar>
      <UserDataTable/>
    </v-flex>
   </v-layout>
</template>
<script>
    import UserDataTable from '~/components/controls/UserDataTable'
    export default {
        middleware: 'granted',
        data:()=>({
            
        }),
        components:{
            UserDataTable
        },
        head () {
          return {
            title:  'Usuarios',
            meta: [
              { hid: 'description', name: 'description', content: 'Lista de usuarios' }
            ]
          }
        }
    }
</script>