<template>
    <v-layout row wrap>
     <v-flex xs12 md12>
      <v-toolbar  color="accent" height="45px">
          <v-toolbar-title class="title_toolbar">Proyectos</v-toolbar-title>
          <v-spacer></v-spacer>
            <v-btn outline small color="primary" to="/projects/new">
              <v-icon>location_city</v-icon>
              Agregar Proyecto
            </v-btn>
      </v-toolbar>
      <ProjectDataTable/>
    </v-flex>
   </v-layout>
</template>
<script>
    import ProjectDataTable from '~/components/datatable/ProjectDataTable'
    export default {
        components:{
            ProjectDataTable
        },
        head () {
          return {
            title:  'Proyectos',
            meta: [
              { hid: 'description', name: 'description', content: 'Lista de proyectos' }
            ]
          }
        }
    }
</script>