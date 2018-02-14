<template>
  <v-app>
      <Nav/>
      <v-content>
       <v-container>
        <nuxt />
       </v-container>
     </v-content>
  </v-app>
</template>

<script>
  import Nav from '~/components/Nav.vue';
  
  export default {
    data() {
      return {
        
      }
    },
    components:{
      Nav
    }
  }
</script>
