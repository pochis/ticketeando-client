<template>
    <v-container grid-list-md text-xs-center>
         <v-toolbar color="accent" height="45px">
          <v-toolbar-title class="title_toolbar">Proyectos</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-flex xs3>
            <v-text-field label="Buscar"></v-text-field>
          </v-flex>
          <v-btn icon>
            <v-icon>search</v-icon>
          </v-btn>
        </v-toolbar>
    <v-layout row wrap>
      <v-flex md3 xs12 v-for="i in 8" :key="`3${i}`">
        <v-card>
            <v-card-media src="/project.png" height="200px">
            </v-card-media>
            <v-card-title primary-title>
              <div>
                <h3 class="headline mb-0">Kangaroo Valley Safari</h3>
                <div>Located two hours south of Sydney in the <br>Southern Highlands of New South Wales, ...</div>
              </div>
            </v-card-title>
            <v-card-actions>
              <v-btn flat color="orange">Ver</v-btn>
            </v-card-actions>
          </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
    export default {
        
        data:()=>({
        }),
        computed:{
            user(){
                return this.$store.getters.loggedUser;
            }
        },
        methods:{
            
        }
    }
    
</script>
