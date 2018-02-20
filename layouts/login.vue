<template>
  <v-app>
      <v-content>
       <v-container grid-list-md text-xs-center>
        <nuxt />
       </v-container>
     </v-content>
  </v-app>
</template>

<script>
  export default {
    data() {
      return {
        
      }
    }
  }
</script>
<style scoped>
    html { 
      background: url('http://www.lebook.com/sites/default/files/styles/showcase_image_large/public/paperscape-2_0.jpg?itok=M77Gxzfc') no-repeat center center fixed; 
      -webkit-background-size: cover;
      -moz-background-size: cover;
      -o-background-size: cover;
      background-size: cover;
    }
</style>