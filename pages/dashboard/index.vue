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
                  <div>{{totalProjects}}</div>
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
                  <div class="headline">Tickets</div>
                  <div>{{totalTickets}}</div>
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
                <div>{{totalOpenTickets}}</div>
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
    async asyncData ({params,store,$axios,error}) {
        let config ={headers:{'Authorization': 'Bearer '+store.state.auth.token}},
        user =store.getters.loggedUser,
        path = (user.role_id==1) ? 'projects/total':'user/'+user.id+'/projects/total',
        ticketsPath = (user.role_id==1) ? 'tickets/total':'user/'+user.id+'/tickets/total',
        ticketsOpenPath = (user.role_id==1) ? 'tickets/total?ticket_status=6':'user/'+user.id+'/tickets/total?ticket_status=6';
        
        return $axios.get(path,config).then((res) => {
          return $axios.get(ticketsPath,config).then((res1)=>{
            return $axios.get(ticketsOpenPath,config).then((res2)=>{
              return {
                    totalProjects: res.data.total,
                    totalTickets: res1.data.total,
                    totalOpenTickets: res2.data.total,
                  }
              })
            })
          }).catch((e) => {
              error({ statusCode: 404, message: 'Proyecto no encontrado' })
        })
      },
    computed:{
      datatableFilter(){
          return {user:this.$store.getters.loggedUser.id}
      },
      user(){
          return this.$store.getters.loggedUser;  
      } 
    },
    components:{
      TicketDataTable
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
