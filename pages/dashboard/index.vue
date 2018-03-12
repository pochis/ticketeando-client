<template>
  <v-container  grid-list-md>
    <v-layout row wrap>
    <v-flex xs12 md4>
        <v-card color="cyan darken-2" class="white--text">
          <v-container fluid grid-list-lg>
            <v-layout row>
              <v-flex xs7>
                <div>
                  <div class="headline">Proyectos</div>
                  <div>0</div>
                </div>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
    </v-flex>
    <v-flex xs12 md4>
        <v-card color="cyan darken-2" class="white--text">
          <v-container fluid grid-list-lg>
            <v-layout row>
              <v-flex xs7>
                <div>
                  <div class="headline">Mis tickets</div>
                  <div>0</div>
                </div>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
    </v-flex>
    <v-flex xs12 md4>
      <v-card color="cyan darken-2" class="white--text">
        <v-container fluid grid-list-lg>
          <v-layout row>
            <v-flex xs7>
              <div>
                <div class="headline">Tickets abiertos</div>
                <div>0</div>
              </div>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-flex>
    <v-flex xs12 md12 class="mt-5">
      <v-toolbar  color="accent" height="45px">
          <v-toolbar-title class="title_toolbar">Mis tickets</v-toolbar-title>
      </v-toolbar>
      <TicketDataTable :filters="datatableFilter"/>
    </v-flex>
  </v-layout>
  </v-container>
  
</template>

<script>

import TicketDataTable from '~/components/datatable/TicketDataTable.vue';
export default {
    
    data:()=>({
      title:'Panel de control',
    }),
    components:{
      TicketDataTable
    },
    computed:{
      datatableFilter(){
          return {user:this.$store.getters.loggedUser.id}
      }
    },
    head () {
      return {
        title: this.title,
        meta: [
          { hid: 'description', name: 'description', content: 'ticketeando contro de soporte para mesa de ayuda' }
        ]
      }
    }
}
</script>
