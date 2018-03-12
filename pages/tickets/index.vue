<template>
    <v-layout row wrap>
     <v-flex xs12 md12>
      <v-toolbar  color="accent" height="45px">
          <v-toolbar-title class="title_toolbar">Tickets</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn outline small color="primary" to="/tickets/new" >
            <v-icon>bug_report</v-icon>
            Agregar Ticket
          </v-btn>
      </v-toolbar>
      <TicketDataTable :filters="datatableFilter"/>
    </v-flex>
   </v-layout>
</template>
<script>
    import TicketDataTable from '~/components/datatable/TicketDataTable'
    export default {
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
            title:  'Tickets',
            meta: [
              { hid: 'description', name: 'description', content: 'Lista de tickets' }
            ]
          }
        }
    }
</script>