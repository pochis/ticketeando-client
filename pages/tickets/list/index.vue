<template>
    <v-layout row wrap>
     <v-flex xs12 md12>
      <v-toolbar  color="accent" height="45px">
          <v-toolbar-title class="title_toolbar">Tickets</v-toolbar-title>
          <v-spacer></v-spacer>
            <v-btn icon to="/tickets/new" title="Agregar Ticket">
              <v-icon>bug_report</v-icon>
            </v-btn>
      </v-toolbar>
      <TicketDataTable/>
    </v-flex>
   </v-layout>
</template>
<script>
    import TicketDataTable from '~/components/controls/TicketDataTable'
    export default {
        components:{
            TicketDataTable
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