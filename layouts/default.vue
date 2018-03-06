<template>
  <v-app>
      <Nav/>
      <v-content v-if="isAuthenticated">
        <nuxt />
     </v-content>
  </v-app>
</template>

<script>
  import Nav from '~/components/Nav.vue';
  import { mapGetters } from 'vuex'
  
  export default {
    middleware: 'guard',
    data:()=>({
      
    }),
    components:{
      Nav
    },
    computed:{
      ...mapGetters(['isAuthenticated'])
    }
  }
</script>
