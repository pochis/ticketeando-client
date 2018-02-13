<template>
  <v-app>
      <Nav/>
     <v-container>
      <nuxt />
     </v-container>
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
