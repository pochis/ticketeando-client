<template>
    <v-layout row wrap>
     <v-flex xs12 md12>
      <v-toolbar  color="accent" height="45px">
          <v-toolbar-title class="title_toolbar">APIs</v-toolbar-title>
          <v-spacer></v-spacer>
            <v-btn outline small color="primary" to="/api/new">
              <v-icon>location_city</v-icon>
              Agregar API
            </v-btn>
      </v-toolbar>
      <ApiDataTable/>
    </v-flex>
   </v-layout>
</template>
<script>
    import ApiDataTable from '~/components/datatable/ApiDataTable'
    export default {
        components:{
            ApiDataTable
        },
        head () {
          return {
            title:  'APIs',
            meta: [
              { hid: 'description', name: 'description', content: 'Lista de APIs' }
            ]
          }
        }
    }
</script>