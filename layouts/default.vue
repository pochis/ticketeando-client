<template>
  <v-app>
      <Nav/>
      <v-content v-if="isAuthenticated">
       <v-container>
        <nuxt />
       </v-container>
     </v-content>
  </v-app>
</template>

<script>
  import Nav from '~/components/Nav.vue';
  import { mapGetters } from 'vuex'
  
  export default {
    data() {
      return {
        
      }
    },
    components:{
      Nav
    },
    computed:{
      ...mapGetters(['isAuthenticated'])
    }
  }
</script>
