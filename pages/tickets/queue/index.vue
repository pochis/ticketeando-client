<template>
    <v-layout row wrap>
     <v-flex xs12 md12>
      <v-toolbar  color="accent" height="45px">
          <v-toolbar-title class="title_toolbar">Tickets disponibles</v-toolbar-title>
          <v-spacer></v-spacer>
      </v-toolbar>
      <TicketDataTable/>
    </v-flex>
   </v-layout>
</template>
<script>
    import TicketDataTable from '~/components/datatable/TicketDataTable'
    export default {
        middleware: 'granted',
        data:()=>({
            
        }),
        methods:{
            
        },
        computed:{
            datatableFilter(){
                return {status:6}
            }
        },
        components:{
            TicketDataTable
        },
        head:()=>({
            title:  'Solicitud de tickets',
            meta: [
              { hid: 'description', name: 'description', content: 'ticketeando contro de soporte para mesa de ayuda' }
            ]
         })
    }
</script>